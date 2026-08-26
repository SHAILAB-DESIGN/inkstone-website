# Home Source Han Serif SC subsets

This directory contains tiered WOFF2 subsets derived from Adobe Source Han Serif 2.003R for the Home page.

## Runtime strategy

The `--font-serif-cjk` token uses three internal families in order:

1. `InkStone Han Serif SC Home` contains every serif title currently rendered by the formal Home page.
2. `InkStone Han Serif SC Common` contains GB2312 symbols and level-1 common Chinese characters not already in Home.
3. `InkStone Han Serif SC Extended` contains GB2312 level-2 characters not already in Home or Common.

Both 600 and 700 weights use exactly the same tiering strategy. A future common copy change therefore falls through to a self-hosted Source Han Serif SC subset instead of an iOS system font. The larger Common and Extended files are only requested when a page actually uses one of their characters.

## Runtime files

| File | Weight | Coverage | Size | SHA-256 |
| --- | ---: | --- | ---: | --- |
| `inkstone-han-serif-sc-home-600.woff2` | 600 | Current Home serif text | 103,436 bytes | `d8fd947fc23ceb59025195027037ab7a90976c85badbd656f69660fa484f5e30` |
| `inkstone-han-serif-sc-home-700.woff2` | 700 | Current Home serif text | 102,968 bytes | `928ae7e6b6bf6f4b9ad277e20a341313d3e68005dc474ba9ac490778ca06b378` |
| `inkstone-han-serif-sc-common-600.woff2` | 600 | GB2312 symbols and level 1 | 1,966,984 bytes | `7a47d23526973cf3347e764282b049c84b0ca278cfadac5386acc5819f66e247` |
| `inkstone-han-serif-sc-common-700.woff2` | 700 | GB2312 symbols and level 1 | 2,021,188 bytes | `df8721438f7d64d50b7715a1ffb76fb3e455a808265a9a8a4ec3bd560e9b94d9` |
| `inkstone-han-serif-sc-extended-600.woff2` | 600 | GB2312 level 2 | 1,695,120 bytes | `ba47c702e51363c79c2ecfd2c311193592f08ff44b5c7689242108ba699046f4` |
| `inkstone-han-serif-sc-extended-700.woff2` | 700 | GB2312 level 2 | 1,747,252 bytes | `1228cdb8c7fd011bc870507a52ae48448ed58b03b25bb7d241a231f4b630000d` |

The current-page Home pair totals 206,404 bytes. Common and Extended are fallback assets, not unconditional preload assets.

## Coverage and validation

`SUBSET_MANIFEST.json` records the coverage strategy, file sizes, hashes, glyph counts, character counts, and missing-character checks. All six generated files contain every requested character, and the current Home serif text has zero missing characters at both 600 and 700.

GB2312 covers ordinary Simplified Chinese copy well, but it is not every Unicode CJK character. If a future title introduces a rare scientific or personal-name character outside GB2312, add that live text to the Home tier and regenerate the subsets.

## Naming and license

The upstream font is licensed under the SIL Open Font License 1.1; see `LICENSE.txt`. Because `Source` is a Reserved Font Name and subsetting creates modified fonts, the runtime families use internal InkStone names.

The original source files are:

- 600: <https://github.com/adobe-fonts/source-han-serif/blob/release/OTF/SimplifiedChinese/SourceHanSerifSC-SemiBold.otf>
- 700: <https://github.com/adobe-fonts/source-han-serif/blob/release/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf>
