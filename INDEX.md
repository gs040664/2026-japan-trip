---
title: 2026 日本自由行專案總目錄索引
tags: [index, moc, second-brain, japan-trip-2026]
updated: 2026-08-26
---

# 2026 日本自由行專案總目錄索引 (Root Index)

本索引為整個旅行第二大腦的最高層級入口，依據 L1-L4 分層管理各模組。

---

## 1. 知識架構導覽

### 🗺️ L4: 核心決策與地圖
- [專案全局指引 (`AGENTS.md`)](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/AGENTS.md) - AI 角色定位與行為準則
- [模組關聯地圖 (`kb/AI_Context_Map.md`)](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/AI_Context_Map.md) - 模組雙向連結與全局視圖
- [相容性規範 (`CLAUDE.md`)](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/CLAUDE.md) - 工具與啟動說明

### 📚 L2: 結構化知識庫 (`kb/`)
| 目錄 | 索引檔案 | 內容概要 |
|:---|:---|:---|
| **每日行程** | [`kb/itinerary/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/itinerary/INDEX.md) | Day 01 ~ Day N 每日細部時間軸、景點銜接與雨備 |
| **景點美食庫** | [`kb/spots/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/spots/INDEX.md) | 依地區分類之景點、美食、咖啡、購物卡片（含 Google Maps 資訊） |
| **實體字典** | [`kb/entities/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/entities/INDEX.md) | 景點/車站/品牌之標準名稱、別名與屬性定義 (YAML Schema) |
| **交通後勤** | [`kb/logistics/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/logistics/INDEX.md) | 新幹線、地鐵通票、JR Pass 評估、eSIM 與行李運送 |
| **住宿清單** | [`kb/stay/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/stay/INDEX.md) | 飯店/溫泉旅館比價、訂房代號與 Check-in 資訊 |
| **預算公費** | [`kb/budget/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/budget/INDEX.md) | 總預算估算、每日花費紀錄、夥伴分帳邏輯 |
| **打包清單** | [`kb/packing/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/packing/INDEX.md) | 11 月秋冬穿著指南、必備文件與隨身物品清單 |
| **重大決策** | [`kb/decisions/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/decisions/INDEX.md) | 方案取捨決策記錄（例如路線選擇、交通票券取捨） |

### 📥 L1: 原始資料層 (`raw/`)
| 目錄 | 索引檔案 | 內容概要 |
|:---|:---|:---|
| **Google 表單** | [`raw/google_forms/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/raw/google_forms/INDEX.md) | 同行者調查問卷、願望清單、飲食禁忌原始回應 |
| **Google Maps** | [`raw/google_maps/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/raw/google_maps/INDEX.md) | Google My Maps KML 匯出、收藏清單 CSV、景點網址集 |
| **預訂憑證** | [`raw/bookings/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/raw/bookings/INDEX.md) | 機票電子收據、飯店預訂確認信、門票憑證備份 |
| **隨手筆記** | [`raw/notes/INDEX.md`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/raw/notes/INDEX.md) | 社群推薦貼文摘錄、零散想法備忘 |

### ⚙️ L3: 工具與產出 (`scripts/` & `output/`)
- [自動化腳本目錄 (`scripts/`)](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/scripts)
  - `sync_google_forms.py` - Google 表單同步
  - `parse_google_maps.py` - Google 地圖 KML/URL 批次解析
  - `generate_handbook.py` - 隨身手冊生成
- [產出交付物 (`output/INDEX.md`)](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/output/INDEX.md)
  - 隨身旅行手冊（Handbook）
  - 手機每日行動卡片（Daily Cards）
