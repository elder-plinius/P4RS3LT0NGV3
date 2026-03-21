# JavaScript directory

Source files here are copied to **`dist/js/`** by `npm run build:copy`. Generated artifacts (`dist/js/bundles/transforms-bundle.js`, `dist/js/data/emojiData.js`) are produced by other build steps.

## Core (`js/core/`)

- `decoder.js` — Universal decoder engine
- `steganography.js` — Emoji / invisible text steganography
- `toolRegistry.js` — Tool registration and Vue data/method merging
- `transformOptions.js` — Shared transform UI helpers

## Utilities (`js/utils/`)

- `clipboard.js`, `focus.js`, `history.js`, `notifications.js`, `theme.js`
- `escapeParser.js` — Escape sequence parsing
- `emoji.js` — `window.EmojiUtils` (uses `window.emojiData` when loaded)
- `glitchTokens.js` — Glitch token panel helpers

## Tools (`js/tools/`)

Classes extending `Tool`; auto-discovered by `build/inject-tool-scripts.js`.

## Data (`js/data/`)

Committed static data: `anticlassifierPrompt.js`, `emojiCompatibility.js`, `endSequences.js`, `glitchTokens.js`, `openrouterModels.js`. **`emojiData.js`** is generated into **`dist/js/data/`** by `npm run build:emoji`, not edited in-repo.

## Bundles

Transformer bundle: **`dist/js/bundles/transforms-bundle.js`** (`npm run build:transforms`). A legacy `js/bundles/transforms-bundle.js` path may be gitignored.

## Typical load order (see `index.template.html`)

1. Data (`emojiData.js`, `emojiCompatibility.js`, …) — `emojiData` from build output in `dist/`
2. Bundles (`transforms-bundle.js`)
3. Utilities (including `emoji.js`)
4. Core (`steganography`, `decoder`, `transformOptions`, …)
5. Tools (`Tool.js`, `*Tool.js`, `toolRegistry.js`)
6. `app.js`
