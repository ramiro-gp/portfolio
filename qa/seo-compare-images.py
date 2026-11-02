"""Compare delivered PNG pixels with the build, without modifying images."""
from pathlib import Path
import json
from PIL import Image, ImageOps
root = Path(__file__).resolve().parents[1]
delivered = root / 'release/seo-public-verified-2026-11-02'
report = []
for source in (root / 'dist').rglob('*.png'):
    relative = source.relative_to(root / 'dist')
    with Image.open(source) as expected, Image.open(delivered / relative) as actual:
        left = ImageOps.exif_transpose(expected).convert('RGBA')
        right = ImageOps.exif_transpose(actual).convert('RGBA')
        report.append({'path': relative.as_posix(), 'size': expected.size, 'same_size': expected.size == actual.size, 'identical_rgba': left.size == right.size and left.tobytes() == right.tobytes(), 'same_icc_profile': expected.info.get('icc_profile') == actual.info.get('icc_profile')})
(root / 'qa/seo/png-delivered-2026-11-02.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf8')
print(json.dumps(report))
assert all(x['same_size'] and x['identical_rgba'] and x['same_icc_profile'] for x in report)
