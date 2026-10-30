"""Regenerate the existing JA subset for the October project update.

Uses the same pinned official font, fonttools 4.66.0 and brotli 1.2.0 as H6.
Tools may be installed in .cache/qa-python; no website dependency is added.
"""
from pathlib import Path
import hashlib
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.cache/qa-python'))
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

source = ROOT / '.cache/noto-source.otf'
expected = '85e5ef353081175fb9f764f037c550dd4b5ad913cb030c0de98a5d4d4018014b'
assert hashlib.sha256(source.read_bytes()).hexdigest() == expected
corpus = ''
for name in ['locales.ts', 'projects.ts']:
    text = (ROOT / 'src/content' / name).read_text(encoding='utf-8')
    corpus += text.split('  ja: {', 1)[1]
font = TTFont(source)
font = instantiateVariableFont(font, {'wght': (400, 600)}, inplace=True)
options = subset.Options()
options.flavor = 'woff2'
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=corpus)
subsetter.subset(font)
missing = sorted(c for c in set(corpus) if ord(c) > 127 and ord(c) not in font.getBestCmap())
assert not missing, missing
font.flavor = 'woff2'
output = ROOT / 'public/fonts/NotoSansJP-ja.woff2'
font.save(output)
report = {
    'source_sha256': expected, 'corpus_files': ['src/content/locales.ts', 'src/content/projects.ts'],
    'codepoints': len(set(corpus)), 'bytes': output.stat().st_size,
    'sha256': hashlib.sha256(output.read_bytes()).hexdigest(), 'missing_ja_glyphs': missing
}
(ROOT / 'qa/projects-update-font-results.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
print(json.dumps(report))
