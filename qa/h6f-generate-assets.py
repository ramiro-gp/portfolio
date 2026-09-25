"""Generate H6.F identity assets from the approved local fonts and palette.

Build-only requirements: Pillow, fontTools, and Brotli. No site dependency is added.
The SVG glyphs are outlines, so the favicon never fetches a font at runtime.
"""

from __future__ import annotations

from pathlib import Path
from tempfile import TemporaryDirectory
from xml.sax.saxutils import escape

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
INSTRUMENT = ROOT / "prototypes/v2-h4/assets/InstrumentSans.ttf"
NOTO = ROOT / "public/fonts/NotoSansJP-ja.woff2"
PUBLIC = ROOT / "public"
SOCIAL = PUBLIC / "social"
PREVIEW = ROOT / "qa/h6f"

PAPER = "#f5f4f0"
CHARCOAL = "#202421"
GREEN = "#176844"
MUTED = "#555b55"

OFFERS = {
    "es": "Diseño y desarrollo de sitios web",
    "en": "Website design and development",
    "pt": "Design e desenvolvimento de sites",
    "fr": "Conception et développement de sites web",
    "ja": "ウェブサイトのデザインと開発",
}


def static_font(source: Path, axes: dict[str, float], destination: Path) -> TTFont:
    font = TTFont(source)
    font = instantiateVariableFont(font, axes, inplace=True)
    font.flavor = None
    font.save(destination)
    return font


def glyph(font: TTFont, character: str) -> tuple[str, tuple[float, float, float, float]]:
    name = font.getBestCmap()[ord(character)]
    glyph_set = font.getGlyphSet()
    path_pen = SVGPathPen(glyph_set)
    bounds_pen = BoundsPen(glyph_set)
    glyph_set[name].draw(path_pen)
    glyph_set[name].draw(bounds_pen)
    assert bounds_pen.bounds is not None
    return path_pen.getCommands(), bounds_pen.bounds


def make_svg(font: TTFont) -> None:
    r_path, r_box = glyph(font, "r")
    dot_path, dot_box = glyph(font, ".")
    scale = 58 / (r_box[3] - r_box[1])
    r_width = (r_box[2] - r_box[0]) * scale
    dot_width = (dot_box[2] - dot_box[0]) * scale
    gap = 3.5
    left = (100 - r_width - gap - dot_width) / 2
    r_top = 21
    r_bottom = r_top + 58
    dot_left = left + r_width + gap
    r_transform = f"translate({left-r_box[0]*scale:.4f} {r_top+r_box[3]*scale:.4f}) scale({scale:.6f} {-scale:.6f})"
    dot_transform = f"translate({dot_left-dot_box[0]*scale:.4f} {r_bottom+dot_box[1]*scale:.4f}) scale({scale:.6f} {-scale:.6f})"
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="r.">\n'
        f'  <rect width="100" height="100" rx="14" fill="{PAPER}"/>\n'
        f'  <path d="{escape(r_path)}" transform="{r_transform}" fill="{CHARCOAL}"/>\n'
        f'  <path d="{escape(dot_path)}" transform="{dot_transform}" fill="{GREEN}"/>\n'
        '</svg>\n'
    )
    (PUBLIC / "favicon.svg").write_text(svg, encoding="utf-8")


def make_icon_png(font_path: Path) -> Image.Image:
    image = Image.new("RGB", (512, 512), PAPER)
    draw = ImageDraw.Draw(image)
    size = 360
    while True:
        font = ImageFont.truetype(str(font_path), size)
        box = draw.textbbox((0, 0), "r", font=font)
        if box[3] - box[1] >= 297:
            break
        size += 1
    dot_box = draw.textbbox((0, 0), ".", font=font)
    r_width, r_height = box[2] - box[0], box[3] - box[1]
    dot_width, dot_height = dot_box[2] - dot_box[0], dot_box[3] - dot_box[1]
    gap = 18
    left = (512 - r_width - gap - dot_width) / 2
    top = (512 - r_height) / 2
    draw.text((left - box[0], top - box[1]), "r", font=font, fill=CHARCOAL)
    draw.text((left + r_width + gap - dot_box[0], top + r_height - dot_height - dot_box[1]), ".", font=font, fill=GREEN)
    return image


def offer_lines(text: str, draw: ImageDraw.ImageDraw, font: ImageFont.FreeTypeFont) -> tuple[str, str]:
    if text == OFFERS["ja"]:
        return "ウェブサイトの", "デザインと開発"
    words = text.split()
    candidates = [(" ".join(words[:i]), " ".join(words[i:])) for i in range(1, len(words))]
    return min(
        candidates,
        key=lambda lines: (max(draw.textlength(line, font=font) for line in lines) > 930,
                           max(draw.textlength(line, font=font) for line in lines),
                           abs(draw.textlength(lines[0], font=font) - draw.textlength(lines[1], font=font))),
    )


def make_social(locale: str, instrument_path: Path, noto_path: Path) -> None:
    factor = 2
    image = Image.new("RGB", (1200 * factor, 630 * factor), PAPER)
    draw = ImageDraw.Draw(image)
    brand_font = ImageFont.truetype(str(instrument_path), 42 * factor)
    name_font = ImageFont.truetype(str(instrument_path), 33 * factor)
    offer_path = noto_path if locale == "ja" else instrument_path
    size = 87 if locale != "ja" else 83
    while True:
        offer_font = ImageFont.truetype(str(offer_path), size * factor)
        lines = offer_lines(OFFERS[locale], draw, offer_font)
        if max(draw.textlength(line, font=offer_font) for line in lines) <= 930 * factor:
            break
        size -= 1
        if size < 58:
            raise ValueError(f"Offer does not fit: {locale}")

    draw.text((82 * factor, 68 * factor), "ramita.dev", font=brand_font, fill=CHARCOAL, anchor="lt")
    for index, line in enumerate(lines):
        draw.text((82 * factor, (206 + index * 109) * factor), line, font=offer_font, fill=CHARCOAL, anchor="lt")
    draw.text((82 * factor, 514 * factor), "Ramiro Garcia", font=name_font, fill=MUTED, anchor="lt")

    stroke = 7 * factor
    draw.line([(1058 * factor, 108 * factor), (1108 * factor, 108 * factor), (1108 * factor, 440 * factor)], fill=GREEN, width=stroke, joint="curve")
    radius = 13 * factor
    draw.ellipse(((1108 * factor - radius, 440 * factor - radius), (1108 * factor + radius, 440 * factor + radius)), fill=GREEN)

    SOCIAL.mkdir(exist_ok=True)
    image.resize((1200, 630), Image.Resampling.LANCZOS).save(SOCIAL / f"ramita-{locale}.png", optimize=True)


def make_previews(icon: Image.Image, instrument_path: Path) -> None:
    PREVIEW.mkdir(exist_ok=True)
    label_font = ImageFont.truetype(str(instrument_path), 20)
    social_sheet = Image.new("RGB", (810, 700), "#e6e8e2")
    social_draw = ImageDraw.Draw(social_sheet)
    for index, locale in enumerate(OFFERS):
        column, row = index % 2, index // 2
        x, y = 24 + column * 396, 18 + row * 226
        social_draw.text((x, y), locale.upper(), font=label_font, fill=CHARCOAL)
        with Image.open(SOCIAL / f"ramita-{locale}.png") as social:
            social_sheet.paste(social.resize((360, 189), Image.Resampling.LANCZOS), (x, y + 28))
    social_sheet.save(PREVIEW / "social-thumbnails.png", optimize=True)

    icon_sheet = Image.new("RGB", (820, 360), "#d8dbd4")
    icon_draw = ImageDraw.Draw(icon_sheet)
    for index, background in enumerate((PAPER, "#171816")):
        x = 20 + index * 400
        icon_draw.rectangle((x, 24, x + 380, 336), fill=background)
        icon_draw.text((x + 20, 40), "Light" if index == 0 else "Dark", font=label_font, fill=CHARCOAL if index == 0 else PAPER)
        for size, position in ((16, (x + 24, 118)), (32, (x + 122, 118))):
            small = icon.resize((size, size), Image.Resampling.LANCZOS)
            icon_sheet.paste(small.resize((size * 5, size * 5), Image.Resampling.NEAREST), position)
            icon_draw.text((position[0], position[1] - 30), f"{size} px", font=label_font, fill=CHARCOAL if index == 0 else PAPER)
    icon_sheet.save(PREVIEW / "icon-sizes.png", optimize=True)


def main() -> None:
    with TemporaryDirectory(prefix="ramita-h6f-") as temp:
        instrument_path = Path(temp) / "InstrumentSans-H6F.ttf"
        noto_path = Path(temp) / "NotoSansJP-H6F.otf"
        instrument = static_font(INSTRUMENT, {"wdth": 100, "wght": 600}, instrument_path)
        static_font(NOTO, {"wght": 600}, noto_path)
        make_svg(instrument)
        icon = make_icon_png(instrument_path)
        icon.save(PUBLIC / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (64, 64)])
        icon.resize((180, 180), Image.Resampling.LANCZOS).save(PUBLIC / "apple-touch-icon.png", optimize=True)
        for locale in OFFERS:
            make_social(locale, instrument_path, noto_path)
        make_previews(icon, instrument_path)
    for path in [PUBLIC / "favicon.svg", PUBLIC / "favicon.ico", PUBLIC / "apple-touch-icon.png", *sorted(SOCIAL.glob("ramita-*.png"))]:
        print(f"{path.relative_to(ROOT)}: {path.stat().st_size} B")


if __name__ == "__main__":
    main()
