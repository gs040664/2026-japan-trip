---
title: Google 表單問卷回應原始資料 (Google Forms Raw Index)
tags: [raw, google-forms, survey, preferences]
updated: 2026-08-26
---

# Google 表單問卷回應原始資料 (raw/google_forms/INDEX.md)

本目錄存放同行旅伴填寫的 Google 表單問卷原始資料，內容包含：
1. **飲食禁忌與喜好**（例如：海鮮過敏、不吃牛、必吃拉麵/和牛/抹茶）
2. **必去景點願望清單**（每人前三大必去推薦）
3. **每日預算與住宿風格偏好**（商務簡約 vs 傳統日式溫泉）
4. **作息風格與體力耐受度**（晨型早起 vs 慢活悠閒、日行萬步耐受度）

---

## 檔案清單
- `sample_responses.csv`：示範問卷資料，可直接用作測試。
- `responses_latest.csv` / `responses_latest.json`：由 `scripts/sync_google_forms.py` 自動拉取的最新檔案。

---

## 同步與更新方式
1. 在 `config/google_config.yaml` 中設定 Google Sheets 發布之 CSV 網址。
2. 執行指令自動抓取並解析：
   ```bash
   python scripts/sync_google_forms.py
   ```
