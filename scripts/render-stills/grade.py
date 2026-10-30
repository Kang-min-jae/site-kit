#!/usr/bin/env python3
"""렌더 후보정 — 디렉션 색감으로 통일: 따뜻한 그림자, 빛 번짐, 가장자리 어둡게, 필름 입자.
사용: python3 scripts/render-stills/grade.py <입력 폴더> <출력 폴더>"""
import sys, pathlib
import numpy as np
from PIL import Image, ImageFilter

src, dst = map(pathlib.Path, sys.argv[1:3])
dst.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(42)
for f in sorted(src.glob("*.png")):
    im = Image.open(f).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255
    # 빛 번짐: 밝은 부분만 흐리게 더한다
    bright = np.clip((a - 0.62) / 0.38, 0, 1)
    glow = np.asarray(Image.fromarray((bright * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(radius=im.width / 60))).astype(np.float32) / 255
    a = a + glow * np.array([0.55, 0.38, 0.2]) * 0.6
    # 색감: 그림자는 따뜻하게, 밝은 곳은 살짝 누르기
    lum = a.mean(axis=2, keepdims=True)
    a = a + (1 - lum) * np.array([0.018, 0.008, -0.006])
    a = a / (1 + a * 0.12)
    # 가장자리 어둡게
    h, w = a.shape[:2]
    y, x = np.ogrid[:h, :w]
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2)
    a = a * (1 - 0.42 * np.clip(d - 0.35, 0, 1) ** 1.6)[..., None]
    # 필름 입자
    a = a + rng.normal(0, 0.018, (h, w, 1))
    out = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    out.save(dst / (f.stem + ".jpg"), quality=86, optimize=True, progressive=True)
    print(f.stem, out.size)
