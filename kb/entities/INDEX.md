---
title: 實體與詞彙庫索引 (Entities Index)
tags: [entities, schema, vocabulary, l0]
updated: 2026-08-26
---

# 實體與詞彙庫索引 (kb/entities/INDEX.md)

本目錄定義本專案標準實體詞彙與關係模型（對應第二大腦 L0 實體層），解決同一景點/店家/車站中日英文名稱不一致、別名混淆與跨系統依賴問題。

---

## 檔案清單

| 檔案 | 格式 | 說明 |
|:---|:---|:---|
| [`spots_vocabulary.yaml`](file:///c:/Users/hugoy/OneDrive/桌面/202611JapanTrip/kb/entities/spots_vocabulary.yaml) | YAML | 景點、車站、美食與品牌之標準名稱、別名清單、分類與關係定義 |

---

## 關係類型說明 (Relation Types)

- **`鄰近 (near)`**：A 與 B 步行 10 分鐘以內可達，適合排在同一時段。
- **`交通連結 (transit_to)`**：A 可直接搭乘大眾運輸直達 B。
- **`前置預約 (requires_booking)`**：訪問 A 必須先完成 B（如購票、預約時段）。
- **`季節相依 (seasonal_match)`**：A 在特定月份/天候具備極佳體驗（如 11 月中下旬夜間賞楓）。
