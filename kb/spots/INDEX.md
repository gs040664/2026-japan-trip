---
title: 景點與美食資料庫索引 (Spots Index)
tags: [spots, attractions, gourmet, shopping]
updated: 2026-08-26
---

# 景點與美食資料庫索引 (kb/spots/INDEX.md)

本目錄存放日本自由行所有經篩選、評估之景點、餐廳、咖啡廳與購物清單。每張景點卡片均包含 Google Maps 座標、開放時間、門票資訊與遊覽建議。

---

## 景點卡片範本
- 📝 [景點卡片標準格式範本 (`spot_template.md`)](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/spots/spot_template.md)

---

## 地區分類清單

### 🗼 東京地區 (`kb/spots/tokyo/`)
| 景點名稱 | 類型 | 區域 | 亮點/標籤 | Google Maps | 檔案連結 |
|:---|:---|:---|:---|:---|:---|
| **SHIBUYA SKY** | 景點/展望台 | 澀谷 | 360度露天夜景、日落黃金時段 | [開啟地圖](https://maps.google.com/?cid=12644265439527715494) | [`shibuya_sky.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/spots/tokyo/shibuya_sky.md) |

### 🍁 關西/京都地區 (`kb/spots/kansai/`)
| 景點名稱 | 類型 | 區域 | 亮點/標籤 | Google Maps | 檔案連結 |
|:---|:---|:---|:---|:---|:---|
| **清水寺** | 景點/古寺 | 京都東山 | 賞楓名所、世界遺產、夜間特別拜觀 | [開啟地圖](https://maps.google.com/?cid=14436577884102917571) | [`kiyomizu_dera.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/spots/kansai/kiyomizu_dera.md) |

---

## 如何由 Google Maps 自動匯入景點
執行解析工具，將 KML 或網址清單自動轉為景點卡片：
```bash
python scripts/parse_google_maps.py
```
