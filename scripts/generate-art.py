#!/usr/bin/env python3
"""Generates the abstract editorial artwork used as replaceable gallery placeholders.

Run: python3 scripts/generate-art.py
Outputs lightweight SVG files into public/media/.
"""
from __future__ import annotations

import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "media"
OUT.mkdir(parents=True, exist_ok=True)

SIZES = {
    "01": (1200, 1500),
    "02": (1600, 1000),
    "03": (1200, 1200),
    "04": (1200, 1600),
    "05": (1600, 900),
    "06": (1200, 1400),
    "07": (1400, 1000),
    "08": (1200, 1500),
    "09": (1400, 1000),
    "10": (1200, 1600),
}

SCHEMES = [
    ("#0b0910", "#241626", "#e6c4a2", "#c98f7a", "#f3e3cf"),
    ("#080c12", "#132430", "#d9c7ae", "#8ea7a3", "#ece2d2"),
    ("#0d0a0c", "#2a1a1c", "#e8c3a6", "#b9766d", "#f6e7d5"),
    ("#090a0e", "#1c1a2b", "#d8c6b2", "#9a8fa8", "#efe6d8"),
    ("#0a0b09", "#1b241d", "#dfcbb0", "#9aa894", "#f0e7d6"),
    ("#0c090f", "#2a1c2b", "#edcdb0", "#c78f9d", "#f8ecdd"),
    ("#080a10", "#17202e", "#d6c5b4", "#b99a7a", "#ece0d0"),
    ("#0b0908", "#271c15", "#e9cba8", "#bd8d6d", "#f5e6d3"),
    ("#090b10", "#1a2233", "#d5c8ba", "#8f9bb3", "#ece3d7"),
    ("#0a090d", "#221a26", "#e7c9ae", "#b58b90", "#f4e5d6"),
]


def grain_filter(idx: int) -> str:
    return f"""
    <filter id="grain{idx}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="{idx * 17}" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
    </filter>"""


def soft_blur(idx: int, amount: float) -> str:
    return f'<filter id="blur{idx}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="{amount}"/></filter>'


def stars(rng: random.Random, w: int, h: int, color: str, count: int = 90) -> str:
    dots = []
    for _ in range(count):
        x, y = rng.uniform(0, w), rng.uniform(0, h)
        r = rng.choice([0.4, 0.5, 0.7, 1.0, 1.4])
        o = rng.uniform(0.08, 0.6)
        dots.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{color}" opacity="{o:.2f}"/>')
    return "".join(dots)


def ribbon(rng: random.Random, w: int, h: int, color: str, idx: int) -> str:
    y0 = rng.uniform(0.2, 0.8) * h
    paths = []
    for k in range(3):
        pts = []
        for i in range(0, 101, 5):
            t = i / 100
            x = t * w
            y = y0 + math.sin(t * math.pi * rng.uniform(1.4, 2.6) + k * 0.7) * h * rng.uniform(0.05, 0.16)
            pts.append((x, y))
        d = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts)
        paths.append(
            f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{rng.uniform(0.8, 2.2):.2f}" '
            f'opacity="{rng.uniform(0.12, 0.4):.2f}" filter="url(#blur{idx})"/>'
        )
    return "".join(paths)


def arch(w: int, h: int, color: str, opacity: float) -> str:
    pad = w * 0.09
    top = h * 0.12
    bottom = h * 0.9
    r = (w - pad * 2) / 2
    cx = w / 2
    return (
        f'<path d="M {pad} {bottom} L {pad} {top + r} A {r} {r} 0 0 1 {w - pad} {top + r} '
        f'L {w - pad} {bottom}" fill="none" stroke="{color}" stroke-width="1" opacity="{opacity}"/>'
    )


def composition(key: str, w: int, h: int, scheme: tuple[str, ...]) -> str:
    idx = int(key)
    rng = random.Random(idx * 101 + 7)
    ink, mid, warm, accent, cream = scheme
    uid = f"a{key}"

    blobs = []
    for i in range(5):
        cx = rng.uniform(-0.1, 1.1) * w
        cy = rng.uniform(-0.1, 1.1) * h
        r = rng.uniform(0.15, 0.55) * max(w, h)
        col = rng.choice([warm, accent, mid, cream])
        blobs.append(
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{col}" opacity="{rng.uniform(0.08, 0.26):.2f}" filter="url(#blur{idx})"/>'
        )

    sun_x, sun_y = rng.uniform(0.3, 0.7) * w, rng.uniform(0.25, 0.6) * h
    sun_r = rng.uniform(0.08, 0.16) * min(w, h)

    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img">
  <defs>
    <linearGradient id="bg{uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{ink}"/><stop offset="0.55" stop-color="{mid}"/><stop offset="1" stop-color="{ink}"/>
    </linearGradient>
    <radialGradient id="sun{uid}" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="{cream}" stop-opacity="0.9"/>
      <stop offset="0.5" stop-color="{warm}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="{accent}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="veil{uid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{ink}" stop-opacity="0.55"/>
      <stop offset="0.45" stop-color="{ink}" stop-opacity="0"/>
      <stop offset="1" stop-color="{ink}" stop-opacity="0.85"/>
    </linearGradient>
    {soft_blur(idx, min(w, h) * 0.06)}
    {soft_blur(idx + 40, 1.2)}
    {grain_filter(idx)}
  </defs>
  <rect width="{w}" height="{h}" fill="url(#bg{uid})"/>
  {''.join(blobs)}
  <circle cx="{sun_x:.1f}" cy="{sun_y:.1f}" r="{sun_r * 2.6:.1f}" fill="url(#sun{uid})" opacity="0.6"/>
  <circle cx="{sun_x:.1f}" cy="{sun_y:.1f}" r="{sun_r:.1f}" fill="{cream}" opacity="0.85" filter="url(#blur{idx + 40})"/>
  {ribbon(rng, w, h, warm, idx)}
  {arch(w, h, cream, 0.22)}
  {stars(rng, w, h, cream, 110)}
  <rect width="{w}" height="{h}" fill="url(#veil{uid})"/>
  <rect width="{w}" height="{h}" filter="url(#grain{idx})" opacity="0.22" style="mix-blend-mode:overlay"/>
  <rect x="14" y="14" width="{w - 28}" height="{h - 28}" fill="none" stroke="{cream}" stroke-opacity="0.12"/>
</svg>
"""


def main() -> None:
    for i, (key, (w, h)) in enumerate(SIZES.items()):
        svg = composition(key, w, h, SCHEMES[i % len(SCHEMES)])
        path = OUT / f"memory-{key}.svg"
        path.write_text(svg, encoding="utf-8")
        print(f"{path.name}: {len(svg) / 1024:.1f} KB")


if __name__ == "__main__":
    main()
