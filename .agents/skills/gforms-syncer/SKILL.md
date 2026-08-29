---
name: gforms-syncer
description: 同步 Google 表單問卷回應並自動萃取旅伴偏好報告的技能。
---

# Google 表單同步與偏好分析技能 (gforms-syncer)

## 技能職責
協助使用者快速從 Google 表單（Google Sheets CSV 發布連結或本地 CSV）拉取最新問卷數據，並生成旅伴偏好報告。

## 操作指令
- 執行 `python scripts/sync_google_forms.py`。
- 檢查產出檔案：
  - `raw/google_forms/responses_latest.json`
  - `raw/google_forms/COMPANION_PREFERENCES.md`
