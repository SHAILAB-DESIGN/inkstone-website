# Home Source Han Serif SC subsets

This directory contains page-specific WOFF2 subsets derived from Adobe Source Han Serif 2.003R for the Home Figma node `198:27482`.

## Runtime files

| File | Weight | Size | SHA-256 |
| --- | ---: | ---: | --- |
| `inkstone-han-serif-sc-home-600.woff2` | 600 | 88,344 bytes | `c81b0cf6fb1f588f7fda416796a81274a5301946c81f19db9d3c37419c1166ee` |
| `inkstone-han-serif-sc-home-700.woff2` | 700 | 75,108 bytes | `c3fd1637bd66c316a217bd096e3a2399b0c04a240a5280d713e101e46add9640` |

The combined transfer size is 163,452 bytes before HTTP transfer overhead. The two full upstream static source files total 50,222,264 bytes and are build inputs only; they are not committed here.

## Coverage

`SUBSET_MANIFEST.json` records every live Figma text node included in each weight. Both outputs also contain a shared baseline of ASCII letters, digits, spaces, and common English/Chinese punctuation.

If any Source Han Serif SC title is added or changed in Figma, regenerate the affected subset and update its size, hash, character count, and node/text ledger. A missing glyph will fall through to the CSS fallback stack, so a successful font request alone is not sufficient validation.

## Naming and license

The upstream font is licensed under the SIL Open Font License 1.1; see `LICENSE.txt`. Because `Source` is a Reserved Font Name and subsetting creates a modified font, the derived internal/web family is named `InkStone Han Serif SC Home`.

The original source files are:

- 600: <https://github.com/adobe-fonts/source-han-serif/blob/release/OTF/SimplifiedChinese/SourceHanSerifSC-SemiBold.otf>
- 700: <https://github.com/adobe-fonts/source-han-serif/blob/release/OTF/SimplifiedChinese/SourceHanSerifSC-Bold.otf>

These assets have been generated but are not yet wired into runtime CSS. When implementation begins, declare both weights with `font-display: swap`, consume the family through a Design System token, and retain the approved Noto Serif SC fallback.
