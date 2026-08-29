---
name: trip-planner
description: 專門用於規劃日本自由行每日行程、排定時間軸、考量日落/營業時間與衝突檢測的專業技能。
---

# 日本自由行行程規劃專屬技能 (trip-planner)

## 技能職責
協助使用者針對特定天數（如 Day 01 到 Day N），依據實體景點庫、交通耗時、營業時間與同行夥伴偏好，建立或優化詳細行程。

## 執行工作流

1. **收集條件 (Context Gathering - L1)**：
   - 檢查 `raw/google_forms/COMPANION_PREFERENCES.md` 獲取夥伴飲食禁忌、作息時間與必訪願望。
   - 檢查 `kb/entities/spots_vocabulary.yaml` 與 `kb/spots/` 確認候選景點清單。

2. **時空與實體約束檢測 (Constraint Checks - L2/L4)**：
   - **日落時間限制**：11 月戶外賞楓或自然景觀須在 16:30 前完成。
   - **地理聚類 (Geographic Clustering)**：同一個半天僅安排同地鐵線或步行 15 分鐘內的景點，禁止東京東西折返。
   - **預約制門票鎖定**：如 SHIBUYA SKY、吉卜力、哈利波特影城等，需特別標示預約前置期（例如 4 週前）。

3. **生成行程草稿 (Draft Generation - L3/L2)**：
   - 依照標準模板生成 `kb/itinerary/DayXX_主題.md`。
   - 包含時間軸、Google Maps 連結、交通方式、預算估計與雨備方案。

4. **更新索引 (Index Refresh)**：
   - 更新 `kb/itinerary/INDEX.md` 與 `kb/AI_Context_Map.md`。
