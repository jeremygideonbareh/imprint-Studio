"""Turns the raw Instagram slides in assets/ig into the web images in public/img.

Imprint's carousel slides are usually a photo on a white or oxblood mat with the couple's names
set underneath. TRIM ids lose the mat (and the names with it); KEEP ids stay as designed.
"""
import os
import sys
from PIL import Image, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'assets', 'ig')
OUT = os.path.join(ROOT, 'public', 'img')
THUMB_WIDTH = 760  # for frames that never fill the screen (tunnel, ring, small reel frames)

TRIM = """
p00_01 p00_03 p02_06 p02_07 p03_01
p04_01 p04_05 p04_06 p04_08 p04_10 p04_11 p04_12
p05_01 p05_02 p05_03 p05_05 p05_06 p05_07 p05_11
p06_04 p06_06 p06_08 p06_10 p06_12 p06_13 p06_14 p06_16 p06_17
p07_02 p07_04 p07_09 p07_14 p07_15
p12_05 p12_07 p12_09 p12_10 p12_12 p12_13 p12_14 p12_15
p19_02 p19_08 p19_18
""".split()
KEEP = 'p00_02 p06_11 p07_06 p19_16'.split()
FULL_SIZE = {'p06_10'}  # the hero photo fills the screen


def is_mat(colour):
    r, g, b = colour
    white = min(colour) > 190
    oxblood = r < 110 and g < 28 and b < 40
    return white or oxblood


def trim(im):
    """Crops to the photo inside a uniform mat; images without one come back unchanged."""
    w, h = im.size
    small = im.resize((w // 4, h // 4), Image.BILINEAR)
    sw, sh = small.size
    corner = small.crop((0, 0, 6, 6)).resize((1, 1), Image.BOX).getpixel((0, 0))
    if not is_mat(corner):
        return im
    # distance from the mat colour, thresholded: 255 wherever the photo (or caption text) is
    diff = ImageChops.difference(small, Image.new('RGB', small.size, corner)).convert('L').point(lambda v: 255 if v > 26 else 0)
    px = diff.load()
    rows = [sum(1 for x in range(sw) if px[x, y]) / sw for y in range(sh)]
    cols = [sum(1 for y in range(sh) if px[x, y]) / sh for x in range(sw)]
    edge = lambda seq: next((i for i, v in enumerate(seq) if v > 0.42), 0)
    top, left = edge(rows), edge(cols)
    bottom, right = sh - edge(rows[::-1]), sw - edge(cols[::-1])
    if (right - left) < sw * 0.3 or (bottom - top) < sh * 0.3:
        return im
    # step inside the hairline that frames the photo (oxblood mats carry a wider inner rule)
    inset = 0.012 if min(corner) > 150 else 0.032
    pad_x, pad_y = int((right - left) * inset) + 1, int((bottom - top) * inset) + 1
    return im.crop(((left + pad_x) * 4, (top + pad_y) * 4, (right - pad_x) * 4, (bottom - pad_y) * 4))


def main(out=OUT, max_side=1800):
    os.makedirs(os.path.join(out, 't'), exist_ok=True)
    total = 0
    for name in TRIM + KEEP:
        im = Image.open(os.path.join(SRC, f'{name}.jpg')).convert('RGB')
        if name in TRIM:
            im = trim(im)
        if name not in FULL_SIZE:
            im.thumbnail((max_side, max_side), Image.LANCZOS)
        path = os.path.join(out, f'{name}.webp')
        im.save(path, 'WEBP', quality=84 if name in FULL_SIZE else 80, method=6)
        total += os.path.getsize(path)
        thumb = im.copy()
        thumb.thumbnail((THUMB_WIDTH, THUMB_WIDTH * 2), Image.LANCZOS)
        thumb.save(os.path.join(out, 't', f'{name}.webp'), 'WEBP', quality=76, method=6)
        print(name, im.size)
    print('images', len(TRIM + KEEP), 'MB', round(total / 1e6, 1))


if __name__ == '__main__':
    main(*sys.argv[1:2])
