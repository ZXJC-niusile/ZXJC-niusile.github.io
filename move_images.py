#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Move and organize images to new directory structure
"""

import os
import shutil
from pathlib import Path

# Configuration
PROJECT_ROOT = Path("E:/github/ZXJC-niusile.github.io")
IMAGES_DIR = PROJECT_ROOT / "images"

# New directory structure
DIRS_TO_CREATE = {
    "avatar": IMAGES_DIR / "avatar",
    "background": IMAGES_DIR / "background",
    "banner": IMAGES_DIR / "banner",
    "ui": IMAGES_DIR / "ui"
}

# Image mappings (source -> destination)
IMAGE_MAPPINGS = {
    "E:/github/ZXJC-niusile.github.io/source/assets/avatar.jpg": DIRS_TO_CREATE["avatar"] / "original.jpg",
    "E:/github/ZXJC-niusile.github.io/themes/async/source/img/avatar.jpg": DIRS_TO_CREATE["avatar"] / "original.jpg",
    "E:/github/ZXJC-niusile.github.io/themes/async/source/img/banner.png": DIRS_TO_CREATE["banner"] / "original.png",
    "E:/github/ZXJC-niusile.github.io/themes/async/source/img/block.jpg": DIRS_TO_CREATE["banner"] / "original.jpg",
    "E:/github/ZXJC-niusile.github.io/themes/async/source/img/404.jpg": DIRS_TO_CREATE["banner"] / "original.jpg",
    "E:/github/ZXJC-niusile.github.io/themes/async/source/img/friend_404.gif": DIRS_TO_CREATE["banner"] / "original.gif",
    "E:/github/ZXJC-niusile.github.io/themes/async/source/img/favicon.svg": DIRS_TO_CREATE["ui"] / "favicon.original.svg",
    "E:/github/ZXJC-niusile.github.io/themes/async/source/img/failure.ico": DIRS_TO_CREATE["ui"] / "failure.ico",
}

def create_directories():
    """Create all required directories"""
    for dir_path in DIRS_TO_CREATE.values():
        dir_path.mkdir(parents=True, exist_ok=True)
        print(f"Created: {dir_path}")

def move_images():
    """Move images from source and themes to images/ directory"""
    moved_count = 0
    skipped_count = 0

    for source_path, dest_info in IMAGE_MAPPINGS.items():
        source_file = Path(source_path)
        dest_path = dest_info

        if not source_file.exists():
            print(f"Skipped (not found): {source_path}")
            skipped_count += 1
            continue

        # Create destination directory if needed
        dest_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            shutil.copy2(source_file, dest_path)
            moved_count += 1
            print(f"Moved: {source_file} -> {dest_path}")
        except Exception as e:
            print(f"Failed: {source_path} -> {dest_path}: {e}")

    print(f"\nSummary:")
    print(f"  Moved: {moved_count} images")
    print(f"  Skipped: {skipped_count} images")

def create_metadata():
    """Create metadata.json file for avatar"""
    metadata = {
        "original": "avatar-original.jpg",
        "alt": "博客头像",
        "usage": ["首页卡片", "侧边栏", "文章列表"],
        "versions": {
            "192": "avatar-192.webp",
            "256": "avatar-256.webp",
            "512": "avatar-512.webp"
        },
        "description": "原文件从 source/assets/avatar.jpg 移动至此，107KB"
    }

    metadata_file = DIRS_TO_CREATE["avatar"] / "metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        import json
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    print(f"Created: {metadata_file}")

def main():
    print("Starting Image Reorganization...")
    print(f"Project: {PROJECT_ROOT}")
    print()

    # Step 1: Create directories
    print("Step 1: Creating directory structure...")
    create_directories()

    # Step 2: Move images
    print("Step 2: Moving images to new structure...")
    move_images()

    # Step 3: Create metadata
    print("Step 3: Creating metadata files...")
    create_metadata()

    print("\nImage reorganization completed!")
    print("New structure:")
    print("images/")
    print("├── avatar/")
    print("│   ├── original.jpg")
    print("│   └── metadata.json")
    print("├── background/")
    print("│   └── original.png")
    print("├── banner/")
    print("│   └── original.png")
    print("├── ui/")
    print("│   ├── favicon.original.svg")
    print("│   └── failure.ico")

if __name__ == "__main__":
    main()
