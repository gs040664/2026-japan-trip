#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
隨身旅遊手冊與每日卡片彙整生成器 (generate_handbook.py)
------------------------------------------------------
功能：
1. 讀取 L2 知識庫 (kb/itinerary, kb/spots, kb/logistics, kb/packing, kb/budget)。
2. 彙編成一本完整且排版優雅的 Markdown 旅遊小手冊 (output/handbook/202611_Japan_Travel_Handbook.md)。
3. 在 output/daily_cards/ 生成每日前端精簡行動卡片，方便旅途中手機離線即時查看。
"""

import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
KB_DIR = BASE_DIR / "kb"
OUTPUT_DIR = BASE_DIR / "output"
HANDBOOK_DIR = OUTPUT_DIR / "handbook"
CARDS_DIR = OUTPUT_DIR / "daily_cards"

def read_file_safe(path):
    if path.exists():
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def strip_frontmatter(content):
    """移除 YAML Frontmatter 以便乾淨拼接入總手冊"""
    lines = content.splitlines()
    if lines and lines[0].strip() == "---":
        for i in range(1, len(lines)):
            if lines[i].strip() == "---":
                return "\n".join(lines[i+1:]).strip()
    return content.strip()

def main():
    HANDBOOK_DIR.mkdir(parents=True, exist_ok=True)
    CARDS_DIR.mkdir(parents=True, exist_ok=True)
    
    print("[*] 正在彙整 L2 知識庫產出隨身旅遊手冊...")
    
    handbook_md = [
        "# 🍁 2026 日本秋季自由行隨身手冊 (Travel Handbook)",
        "",
        "> **旅程日期**：2026 年 11 月  ",
        "> **目的地**：東京 ➔ 京都 / 關西  ",
        "> **版本**：自動彙整發行版  ",
        "",
        "---",
        "",
        "## 📑 目錄",
        "1. [重要後勤、交通票券與緊急聯絡](#1-重要後勤交通票券與緊急聯絡)",
        "2. [11月秋季行前打包清單](#2-11月秋季行前打包清單)",
        "3. [每日詳細行程表](#3-每日詳細行程表)",
        "4. [旅程預算與公費追蹤](#4-旅程預算與公費追蹤)",
        "",
        "---",
        "",
        "## 1. 重要後勤、交通票券與緊急聯絡",
        ""
    ]
    
    # 注入交通票券
    transit_content = read_file_safe(KB_DIR / "logistics" / "transit_passes.md")
    if transit_content:
        handbook_md.append(strip_frontmatter(transit_content))
        handbook_md.append("\n---\n")
        
    # 注入打包清單
    handbook_md.append("## 2. 11月秋季行前打包清單\n")
    packing_content = read_file_safe(KB_DIR / "packing" / "autumn_checklist.md")
    if packing_content:
        handbook_md.append(strip_frontmatter(packing_content))
        handbook_md.append("\n---\n")
        
    # 注入每日行程
    handbook_md.append("## 3. 每日詳細行程表\n")
    itinerary_dir = KB_DIR / "itinerary"
    itinerary_files = sorted([f for f in itinerary_dir.glob("Day*.md")])
    
    if itinerary_files:
        for f in itinerary_files:
            day_text = read_file_safe(f)
            handbook_md.append(f"### 📍 {f.stem}\n")
            handbook_md.append(strip_frontmatter(day_text))
            handbook_md.append("\n---\n")
            
            # 生成單日行動卡片
            card_path = CARDS_DIR / f"{f.stem}_Card.md"
            with open(card_path, "w", encoding="utf-8") as card_f:
                card_f.write(f"# 📱 {f.stem} 隨身行動卡\n\n" + strip_frontmatter(day_text))
            print(f"  [+] 生成單日行動卡片: {card_path.name}")
    else:
        handbook_md.append("*(尚無排定之每日行程)*\n")
        
    # 注入預算與分帳
    handbook_md.append("## 4. 旅程預算與公費追蹤\n")
    budget_content = read_file_safe(KB_DIR / "budget" / "expense_tracker.md")
    if budget_content:
        handbook_md.append(strip_frontmatter(budget_content))
        
    final_output_path = HANDBOOK_DIR / "202611_Japan_Travel_Handbook.md"
    with open(final_output_path, "w", encoding="utf-8") as out_f:
        out_f.write("\n".join(handbook_md))
        
    print(f"\n[✓] 隨身旅遊手冊生成完畢: {final_output_path.relative_to(BASE_DIR)}")
    print(f"[✓] 每日行動卡片已產生於: {CARDS_DIR.relative_to(BASE_DIR)}")

if __name__ == "__main__":
    main()
