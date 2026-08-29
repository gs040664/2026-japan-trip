---
title: Google 地圖原始資料目錄 (Google Maps Raw Index)
tags: [raw, google-maps, my-maps, kml, coordinates]
updated: 2026-08-26
---

# Google 地圖原始資料目錄 (raw/google_maps/INDEX.md)

本目錄存放 Google Maps 與 Google My Maps（我的地圖）導出之景點標記、圖層與路線檔案。

---

## 檔案清單
- `sample_places.kml`：示範 Google My Maps KML 格式檔案（含東京與京都代表性景點座標與標註）。
- `places_urls.txt`：Google Maps 景點分享網址或短網址收集清單。

---

## 解析與轉譯至 L2
執行解析腳本，將本目錄下的 KML 或 URL 清單自動提煉至 `kb/spots/` 與 `kb/entities/`：
```bash
python scripts/parse_google_maps.py
```
