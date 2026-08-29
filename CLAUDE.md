# 202611JapanTrip 專案規範與配置 (CLAUDE.md)

## 專案概述
- **目標**：2026 年 11 月日本秋季自由行規劃（賞楓、美食、城市探索、交通住宿與預算管理）。
- **知識庫理念**：承襲第二大腦架構（L1 原始層、L2 知識庫、L3 工具/技能、L4 策略/指引）。

## 啟動與檢索規範
1. 每次開始對話或規劃前，請先讀取 `INDEX.md` 與 `kb/AI_Context_Map.md` 掌握整體專案與每日進度。
2. 規劃行程時，應先核對 `raw/google_forms/` 的旅伴偏好，並從 `kb/spots/` 篩選相應景點。
3. 產生或更新任何檔案時，務必維護該目錄下的 `INDEX.md`。

## 關鍵路徑
- **頂層目錄**：`INDEX.md`
- **知識庫關聯地圖**：`kb/AI_Context_Map.md`
- **實體與詞彙庫**：`kb/entities/spots_vocabulary.yaml`
- **每日行程**：`kb/itinerary/`
- **景點資料庫**：`kb/spots/`
- **交通票券**：`kb/logistics/`
- **預算分攤**：`kb/budget/`
- **原始資料**：`raw/`（含 `google_forms/` 與 `google_maps/`）
- **自動化工具**：`scripts/`

## 工具執行指南
- 同步 Google 表單：`python scripts/sync_google_forms.py`
- 解析 Google 地圖：`python scripts/parse_google_maps.py`
- 彙整輸出小手冊：`python scripts/generate_handbook.py`
