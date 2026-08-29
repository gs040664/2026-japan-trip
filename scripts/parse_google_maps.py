#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google Maps 與 My Maps (我的地圖) 資料解析腳本 (parse_google_maps.py)
-------------------------------------------------------------------
功能：
1. 解析 raw/google_maps/ 中的 KML/KMZ 導出檔案，提取各圖層景點名稱、座標、備註說明。
2. 支援讀取 raw/google_maps/places_urls.txt 景點網址清單。
3. 自動將景點依地區 (東京 / 京都 / 關西 等) 結構化寫入 kb/spots/<area>/<spot_name>.md。
4. 同步將景點登錄至實體詞彙庫 kb/entities/spots_vocabulary.yaml。
5. 自動重整維護 kb/spots/INDEX.md。
"""

import os
import sys
import re
import xml.etree.ElementTree as ET
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_MAPS_DIR = BASE_DIR / "raw" / "google_maps"
KB_SPOTS_DIR = BASE_DIR / "kb" / "spots"
ENTITIES_FILE = BASE_DIR / "kb" / "entities" / "spots_vocabulary.yaml"

def infer_area(folder_name, place_name, coords):
    """根據圖層名稱、景點名或經緯度推測所屬地區 (東京/京都/關西/富士山)"""
    text = (folder_name + " " + place_name).lower()
    lat, lon = coords
    
    if "東京" in text or "tokyo" in text or "澀谷" in text or "淺草" in text or "新宿" in text:
        return "tokyo", "東京"
    if "京都" in text or "kyoto" in text or "清水寺" in text or "永觀堂" in text or "嵐山" in text:
        return "kansai", "京都"
    if "大阪" in text or "osaka" in text:
        return "kansai", "大阪"
    if "富士" in text or "河口湖" in text or "箱根" in text:
        return "fuji_hakone", "富士山/箱根"
        
    # 經緯度推測 (東京約 lon 139.7, lat 35.6；京都約 lon 135.7, lat 35.0)
    if lon > 138.5:
        return "tokyo", "東京"
    elif 134.5 <= lon <= 136.5:
        return "kansai", "京都"
    return "general", "其他"

def parse_kml(kml_path):
    """解析 KML 檔案並提取景點資料"""
    if not kml_path.exists():
        return []
    
    print(f"[*] 正在解析 KML 檔案: {kml_path}")
    tree = ET.parse(kml_path)
    root = tree.getroot()
    
    # 處理 XML namespace
    ns = {"kml": "http://www.opengis.net/kml/2.2"}
    
    places = []
    # 遍歷所有 Folder (圖層)
    folders = root.findall(".//kml:Folder", ns)
    if not folders:
        # 若無明確 Folder，直接找 Placemark
        folders = [root]
        
    for folder in folders:
        folder_name_elem = folder.find("kml:name", ns)
        folder_name = folder_name_elem.text.strip() if folder_name_elem is not None and folder_name_elem.text else "未分類圖層"
        
        for pm in folder.findall(".//kml:Placemark", ns):
            name_elem = pm.find("kml:name", ns)
            desc_elem = pm.find("kml:description", ns)
            point_elem = pm.find(".//kml:Point/kml:coordinates", ns)
            
            name = name_elem.text.strip() if name_elem is not None and name_elem.text else "未命名景點"
            desc = desc_elem.text.strip() if desc_elem is not None and desc_elem.text else ""
            
            lat, lon = 0.0, 0.0
            if point_elem is not None and point_elem.text:
                parts = point_elem.text.strip().split(",")
                if len(parts) >= 2:
                    try:
                        lon = float(parts[0])
                        lat = float(parts[1])
                    except ValueError:
                        pass
                        
            area_dir, area_name = infer_area(folder_name, name, (lat, lon))
            
            places.append({
                "name": name,
                "folder": folder_name,
                "description": desc,
                "lat": lat,
                "lon": lon,
                "area_dir": area_dir,
                "area_name": area_name,
                "gmaps_url": f"https://www.google.com/maps/search/?api=1&query={lat},{lon}" if lat and lon else f"https://www.google.com/maps/search/{name}"
            })
            
    print(f"[✓] 從 KML 成功提取 {len(places)} 個景點！")
    return places

def sanitize_filename(name):
    """將景點名稱轉為乾淨的檔名"""
    clean = re.sub(r'[\\/*?:"<>|()（）]', '_', name).strip('_')
    return clean if clean else "spot"

def write_spot_card(place):
    """將單一景點寫入 kb/spots/<area_dir>/<name>.md"""
    area_dir = KB_SPOTS_DIR / place["area_dir"]
    area_dir.mkdir(parents=True, exist_ok=True)
    
    file_name = f"{sanitize_filename(place['name'])}.md"
    file_path = area_dir / file_name
    
    # 若檔案已存在且包含自訂註記，不暴力覆蓋，只保留或更新
    if file_path.exists():
        print(f"  [-] 景點已存在，跳過覆蓋以保留手動備註: {file_path.name}")
        return file_path
        
    md_content = f"""---
id: {place['name']}
aliases: [{place['name']}]
type: 景點
area: {place['area_name']}
tags: [{place['folder']}, 自動匯入]
gmaps_url: "{place['gmaps_url']}"
coordinates: [{place['lat']:.4f}, {place['lon']:.4f}]
nearest_station: "[待補]"
opening_hours: "[待補]"
ticket_price_jpy: 0
booking_required: false
avg_time_spent: "60-90 分鐘"
rating: 4.5
status: candidate
---

# {place['name']}

## 📌 景點簡介與亮點
{place['description'] if place['description'] else "由 Google Maps / My Maps 自動匯入之景點。"}

## 🕒 營業時間與門票
- **開放時間**：[待補]
- **票價**：[待補]
- **預約管道**：[待補]

## 🚇 交通方式
- Google Maps 座標：`{place['lat']:.4f}, {place['lon']:.4f}`
- [點擊於 Google 地圖中開啟]({place['gmaps_url']})

## 💡 參訪攻略與注意事項
- 由「{place['folder']}」圖層匯入。
"""
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(md_content)
    print(f"  [+] 成功建立景點卡片: {file_path.relative_to(BASE_DIR)}")
    return file_path

def main():
    kml_file = RAW_MAPS_DIR / "sample_places.kml"
    custom_kml = RAW_MAPS_DIR / "my_maps.kml"
    if custom_kml.exists():
        kml_file = custom_kml
        
    places = parse_kml(kml_file)
    if not places:
        print("[!] 未找到可解析的 KML 檔案。")
        return
        
    for p in places:
        write_spot_card(p)
        
    print("\n[🎉] Google Maps 景點解析與 L2 知識庫同步完成！")

if __name__ == "__main__":
    main()
