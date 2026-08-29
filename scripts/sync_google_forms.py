#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google 表單問卷回應同步與分析腳本 (sync_google_forms.py)
---------------------------------------------------------
功能：
1. 從發布至網路的 Google Sheets CSV 網址下載最新問卷資料，或讀取本地 CSV 備份。
2. 儲存原始資料至 raw/google_forms/responses_latest.csv 及 responses_latest.json。
3. 自動分析並萃取旅伴的：
   - 必訪願望景點 (Must-visit Wishlist)
   - 飲食喜好與過敏禁忌 (Dietary Restrictions)
   - 每日預算區間 (Daily Budget)
   - 作息風格與體力步行耐受度 (Pace & Walking Tolerance)
4. 生成旅伴偏好摘要報告 raw/google_forms/COMPANION_PREFERENCES.md 供 L2 行程規劃參考。
"""

import os
import sys
import csv
import json
import urllib.request
import urllib.error
from pathlib import Path

# 專案根目錄定位
BASE_DIR = Path(__file__).resolve().parent.parent
CONFIG_PATH = BASE_DIR / "config" / "google_config.yaml"
EXAMPLE_CONFIG_PATH = BASE_DIR / "config" / "google_config.example.yaml"
RAW_FORMS_DIR = BASE_DIR / "raw" / "google_forms"

def load_config():
    """載入設定檔 (若無 pyyaml 則以簡單規則解析或採用預設值)"""
    config_file = CONFIG_PATH if CONFIG_PATH.exists() else EXAMPLE_CONFIG_PATH
    if not config_file.exists():
        return {}
    
    config = {}
    try:
        import yaml
        with open(config_file, "r", encoding="utf-8") as f:
            return yaml.safe_load(f) or {}
    except ImportError:
        # 簡易鍵值解析 fallback
        with open(config_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("sheet_csv_url:"):
                    val = line.split(":", 1)[1].strip().strip('"').strip("'")
                    if "google_forms" not in config:
                        config["google_forms"] = {}
                    config["google_forms"]["sheet_csv_url"] = val
                elif line.startswith("local_csv_path:"):
                    val = line.split(":", 1)[1].strip().strip('"').strip("'")
                    if "google_forms" not in config:
                        config["google_forms"] = {}
                    config["google_forms"]["local_csv_path"] = val
    return config

def fetch_csv_content(url_or_path):
    """取得 CSV 文字內容（支援網路 URL 或本地檔案路徑）"""
    if str(url_or_path).startswith("http://") or str(url_or_path).startswith("https://"):
        print(f"[*] 正在從 Google Sheets 下載最新問卷 CSV: {url_or_path} ...")
        headers = {"User-Agent": "Mozilla/5.0"}
        req = urllib.request.Request(url_or_path, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=15) as response:
                return response.read().decode("utf-8")
        except urllib.error.URLError as e:
            print(f"[!] 網路下載失敗 ({e})，嘗試使用本地範例備份...")
            return None
    else:
        file_path = BASE_DIR / url_or_path
        if file_path.exists():
            print(f"[*] 讀取本地 CSV 檔案: {file_path}")
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        return None

def parse_and_summarize(csv_text):
    """解析 CSV 並生成結構化資料與摘要報告"""
    RAW_FORMS_DIR.mkdir(parents=True, exist_ok=True)
    
    # 儲存最新 CSV
    latest_csv_path = RAW_FORMS_DIR / "responses_latest.csv"
    with open(latest_csv_path, "w", encoding="utf-8", newline="") as f:
        f.write(csv_text)
    
    lines = csv_text.strip().splitlines()
    reader = csv.DictReader(lines)
    records = list(reader)
    
    # 儲存 JSON
    latest_json_path = RAW_FORMS_DIR / "responses_latest.json"
    with open(latest_json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
        
    print(f"[✓] 成功解析 {len(records)} 筆旅伴問卷回應！")
    
    # 產出 Markdown 摘要報告
    report_path = RAW_FORMS_DIR / "COMPANION_PREFERENCES.md"
    
    report_content = [
        "---",
        "title: 同行旅伴需求與偏好整合報告 (Companion Preferences Summary)",
        "tags: [preferences, survey, companions, l1-summary]",
        f"total_responses: {len(records)}",
        "---",
        "",
        "# 同行旅伴需求與偏好整合報告",
        "",
        "> 本報告由 `scripts/sync_google_forms.py` 自動生成，供 L2 行程（`kb/itinerary/`）與餐廳挑選時之核心約束參照。",
        "",
        "## 1. 旅伴一覽與核心需求彙整",
        ""
    ]
    
    report_content.append("| 姓名/暱稱 | 預算區間 | 飲食偏好與禁忌 | 心中第一名必去景點 | 作息與步行耐受度 |")
    report_content.append("|:---|:---|:---|:---|:---|")
    
    must_visits = []
    dietary_notes = []
    
    for r in records:
        # 自動容錯取得欄位
        name = r.get("填答者姓名/暱稱") or r.get("姓名") or r.get("暱稱") or list(r.values())[1] if len(r) > 1 else "旅伴"
        budget = r.get("每日預算範圍") or r.get("預算") or "未填"
        diet = r.get("飲食禁忌與喜好 (例如不吃牛、海鮮過敏、必吃拉麵)") or r.get("飲食禁忌") or "無特殊禁忌"
        must_go = r.get("本次旅程心中第一名必去景點") or r.get("必去景點") or "無特定"
        wake = r.get("作息風格 (晨型人/自然醒/夜貓)") or r.get("作息風格") or "彈性"
        walk = r.get("每日步行耐受度 (輕鬆漫遊/日行萬步/極限行軍)") or r.get("步行耐受度") or "正常"
        
        report_content.append(f"| **{name}** | {budget} | {diet} | **{must_go}** | {wake} / {walk} |")
        
        must_visits.append(f"- **{name}**：{must_go}")
        dietary_notes.append(f"- **{name}**：{diet}")
        
    report_content.extend([
        "",
        "## 2. 跨旅伴決策約束條款",
        "",
        "### 🚩 必訪景點聚合 (Must-Visit Aggregate)",
        *must_visits,
        "",
        "### 🍜 飲食安排防雷守則 (Dietary Constraints)",
        *dietary_notes,
        "- **排餐原則**：若選擇居酒屋或燒肉店，確認菜單同時提供多樣化熟食、野菜與非牛肉/非生食選項。",
        "",
        "### 🚶 作息與行程節奏調配 (Pacing & Rhythm)",
        "- **早晨出發時間**：建議抓在 **08:15 - 08:30** 之間出門，兼顧晨型景點避開人潮與旅伴睡眠品質。",
        "- **午後體力回血**：每日下午 14:00 - 15:30 安排特色咖啡廳或室內觀景點（如 SHIBUYA SKY / 庭園茶室）休憩 45-60 分鐘。"
    ])
    
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("\n".join(report_content))
        
    print(f"[✓] 旅伴偏好摘要已更新至: {report_path}")

def main():
    config = load_config()
    gf_config = config.get("google_forms", {})
    
    url = gf_config.get("sheet_csv_url", "")
    local_path = gf_config.get("local_csv_path", "raw/google_forms/sample_responses.csv")
    
    csv_text = None
    if url and not url.startswith("https://docs.google.com/spreadsheets/d/e/2PACX-xxxxxxx"):
        csv_text = fetch_csv_content(url)
    
    if not csv_text:
        csv_text = fetch_csv_content(local_path)
        
    if not csv_text:
        print("[!] 找不到可用的 CSV 資料來源，請檢查 config/google_config.yaml 或 raw/google_forms/sample_responses.csv")
        sys.exit(1)
        
    parse_and_summarize(csv_text)
    print("\n[🎉] Google 表單問卷同步與分析完成！")

if __name__ == "__main__":
    main()
