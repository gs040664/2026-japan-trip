---
name: gmaps-parser
description: 解析 Google My Maps (我的地圖) KML/KMZ 檔案或 Google Maps 網址清單並建置景點庫的技能。
---

# Google Maps 資料解析技能 (gmaps-parser)

## 技能職責
自動將使用者匯出的 Google My Maps KML 或景點網址，批次轉為 `kb/spots/` 中的標準景點 Markdown 卡片，並登錄至實體 Schema。

## 操作指令
- 確保 KML 放置於 `raw/google_maps/`（如 `sample_places.kml` 或 `my_maps.kml`）。
- 執行 `python scripts/parse_google_maps.py`。
- 檢查產出檔案：
  - `kb/spots/tokyo/`、`kb/spots/kansai/` 等地區卡片
  - `kb/entities/spots_vocabulary.yaml`
