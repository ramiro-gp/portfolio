"""Build H6 WOFF2 assets from the approved local font sources.

Tooling: fonttools 4.66.0 and brotli 1.2.0 (build tools, not site dependencies).
Noto source: notofonts/noto-cjk, commit f8d157532fbfaeda587e826d4cd5b21a49186f7c,
Sans/Variable/OTF/Subset/NotoSansJP-VF.otf, SIL OFL 1.1.
Download URL: https://raw.githubusercontent.com/notofonts/noto-cjk/f8d157532fbfaeda587e826d4cd5b21a49186f7c/Sans/Variable/OTF/Subset/NotoSansJP-VF.otf
Place the official source at qa/h6-noto-source.otf before running; its expected
SHA-256 is 85e5ef353081175fb9f764f037c550dd4b5ad913cb030c0de98a5d4d4018014b.
Re-run after the JA public copy changes, including H6.E LingoHive text.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "qa/h6-noto-source.otf"
INSTRUMENT = ROOT / "prototypes/v2-h4/assets/InstrumentSans.ttf"
NAMES = ROOT / "src/content/locales.ts"
OUT = ROOT / "public/fonts"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save_woff2(font: TTFont, path: Path) -> None:
    font.flavor = "woff2"
    font.save(path)


def main() -> None:
    if not SOURCE.exists():
        sys.exit(f"Missing official Noto source: {SOURCE}")
    expected_source_sha = "85e5ef353081175fb9f764f037c550dd4b5ad913cb030c0de98a5d4d4018014b"
    if sha256(SOURCE) != expected_source_sha:
        sys.exit("Noto source hash differs from the approved H6 source")

    content = NAMES.read_text(encoding="utf-8")
    start = re.search(r"\bja:\s*\{", content)
    if start is None:
        sys.exit("Cannot find JA locale block")
    end = content.find("\n  }\n};", start.end())
    if end < 0:
        sys.exit("Cannot find end of JA locale block")
    corpus = content[start.start() : end]
    chars = set(corpus)

    noto = TTFont(SOURCE)
    source_cmap = noto.getBestCmap()
    missing = sorted(char for char in chars if ord(char) > 127 and ord(char) not in source_cmap)
    if missing:
        sys.exit(f"Missing JA corpus glyphs: {missing}")
    noto = instantiateVariableFont(noto, {"wght": (400, 600)}, inplace=True)
    options = subset.Options()
    options.flavor = "woff2"
    sub = subset.Subsetter(options=options)
    sub.populate(text=corpus)
    sub.subset(noto)
    if not chars.issubset({chr(codepoint) for codepoint in noto.getBestCmap()} | {"\n", "\r", "\t"}):
        # Source code punctuation may be outside the font and is not public text.
        public_missing = sorted(char for char in chars if ord(char) > 127 and ord(char) not in noto.getBestCmap())
        if public_missing:
            sys.exit(f"Subset lost JA glyphs: {public_missing}")
    noto_path = OUT / "NotoSansJP-ja.woff2"
    save_woff2(noto, noto_path)

    instrument_path = OUT / "InstrumentSans.woff2"
    if not instrument_path.exists():
        instrument = TTFont(INSTRUMENT)
        save_woff2(instrument, instrument_path)

    result = {
        "noto_source": "notofonts/noto-cjk@f8d157532fbfaeda587e826d4cd5b21a49186f7c/Sans/Variable/OTF/Subset/NotoSansJP-VF.otf",
        "noto_source_sha256": sha256(SOURCE),
        "ja_corpus_codepoints": len(chars),
        "noto_weight_range": [400, 600],
        "fonts": [
            {"path": str(instrument_path.relative_to(ROOT)), "bytes": instrument_path.stat().st_size, "sha256": sha256(instrument_path)},
            {"path": str(noto_path.relative_to(ROOT)), "bytes": noto_path.stat().st_size, "sha256": sha256(noto_path)},
        ],
        "must_regenerate_after_h6e": True,
    }
    (ROOT / "qa/h6-fonts-results.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
