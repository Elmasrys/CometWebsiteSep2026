"""Grade Comet photography into the house look and export responsive web formats.

Run from the repository root:  python3 tools/grade-images.py
Masters live untouched in assets/source/; every output is regenerated from them,
so the grade never compounds and new photography can join the set consistently.

The house look (see docs/artwork-brief.md):
  - warm-neutral monochrome: colour removed, then a faint greige warmth, no orange
  - lifted shadows (black point about #1B1A18) and soft highlight roll-off (never clipped)
  - gentle contrast and fine, static grain for a medium-format finish
"""
import pathlib
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "source"
OUT = ROOT / "public" / "images"

# name -> (master file, output basename, widths)
IMAGES = {
    "gateway": ("gateway.jpg", "home-hero", [960, 1586]),
}

BLACK = 0.105   # lifted black point, about #1B1A18 (never pure black)
WHITE = 0.945   # highlight ceiling, soft roll-off below it
TINT = np.array([1.000, 0.985, 0.958])  # restrained warmth towards greige
GRAIN = 0.011   # grain strength in linear-ish luminance units
SEED = 7


def srgb_to_linear(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(c):
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * np.power(np.clip(c, 0, None), 1 / 2.4) - 0.055)


def grade(img: Image.Image) -> Image.Image:
    rgb = np.asarray(img.convert("RGB"), dtype=np.float64) / 255.0
    lin = srgb_to_linear(rgb)
    # Perceptual luminance from linear light, back to display space for tone shaping.
    y = linear_to_srgb(0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2])
    # Gentle contrast: a mild S around the midpoint (deep tones stay deep).
    y = np.clip(0.5 + (y - 0.5) * 1.0, 0, 1)
    # Soft highlight roll-off: compress only the top of the range, leave shadows and mids alone.
    knee = 0.72
    over = np.clip(y - knee, 0, None)
    y = np.where(y > knee, knee + (1 - knee) * (1 - np.exp(-over / (1 - knee) * 1.6)) / (1 - np.exp(-1.6)), y)
    # Map into the lifted range so no pixel is pure black or pure white.
    y = BLACK + (WHITE - BLACK) * y
    # Fine static grain, slightly softened so it reads as film rather than digital noise.
    rng = np.random.default_rng(SEED)
    noise = rng.normal(0, 1, y.shape)
    noise = (noise + np.roll(noise, 1, 0) + np.roll(noise, 1, 1) + np.roll(np.roll(noise, 1, 0), 1, 1)) / 2
    y = y + noise * GRAIN * (0.6 + 0.4 * (1 - np.abs(y - 0.5) * 2))
    out = np.clip(y[..., None] * TINT, 0, 1)
    return Image.fromarray((out * 255 + 0.5).astype(np.uint8), "RGB")


def main():
    for name, (master, base, widths) in IMAGES.items():
        src = Image.open(SRC / master)
        graded = grade(src)
        for w in widths:
            h = round(graded.height * w / graded.width)
            im = graded if w == graded.width else graded.resize((w, h), Image.LANCZOS)
            im.save(OUT / f"{base}-{w}.webp", quality=82, method=6)
            im.save(OUT / f"{base}-{w}.avif", quality=62)
            if w == max(widths):
                im.save(OUT / f"{base}-{w}.jpg", quality=84, optimize=True, progressive=True)
        lum = np.asarray(graded.convert("L"), dtype=np.float64) / 255
        print(f"{name}: luminance min {lum.min():.3f}, p1 {np.percentile(lum, 1):.3f}, p99 {np.percentile(lum, 99):.3f}, max {lum.max():.3f}")


if __name__ == "__main__":
    main()
