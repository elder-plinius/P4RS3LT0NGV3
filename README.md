# 🐍 P4RS3LT0NGV3 - Universal Text Translator

A powerful web-based text transformation and steganography tool with **159** built-in text transforms spanning encodings, classical and modern ciphers, Unicode styles, formatting, and niche alphabets. Think of it as a universal translator for ALL alphabets and writing systems! 

The app is a **static site**: run **`npm run build`** (after `npm install`), then open **`dist/index.html`** in your browser—no local server required. **Alternatively**, you can run it as a local app over HTTP with **`npm start`** or **`npx serve dist -l 8080`** (see [Getting Started](#getting-started) below). Core transforms, decoder, and steganography work **without** calling the cloud; features that use [OpenRouter](https://openrouter.ai/) need **network access** and an API key (see below).

## ✨ Features

### 🔐 **Steganography**
- **Emoji Steganography**: Hide messages within emojis using variation selectors (VS15/VS16 and related options; configurable bit order in Advanced Settings)
- **Invisible Text**: Encode text using Unicode Tags block (visually invisible)
- **Whitespace & zero-width steganography**: Available as transforms for research-style payloads (see transform categories)

### 🌍 **Text Transformations**

Categories match the Transform tab and the folders under `src/transformers/` (each transformer’s `name` as shown in the UI). Short descriptions explain what each transform does.

#### **Ancient**
- **Elder Futhark** - Germanic Elder Futhark runes
- **Hieroglyphics** - Egyptian hieroglyph-style mapping
- **Ogham (Celtic)** - Celtic Ogham tree alphabet
- **Roman Numerals** - Arabic numerals ↔ Roman numerals

#### **Case**
- **Alternating Case** - Alternate uppercase and lowercase per letter (first letter upper or lower)
- **camelCase** - lowerCamelCase for identifiers
- **kebab-case** - kebab-case for slugs and identifiers
- **Random Case** - Random casing per character
- **Sentence Case** - Capitalize the first letter of each sentence
- **snake_case** - snake_case for identifiers
- **Title Case** - Capitalize each word

#### **Cipher**
- **ADFGX Cipher** - WWI ADFGVX-style polybius + column transposition
- **Affine Cipher** - Affine substitution (ax + b mod 26)
- **Atbash Cipher** - Reverse-alphabet substitution (A↔Z)
- **Autokey Cipher** - Key stream mixed with plaintext (autokey)
- **Baconian Cipher** - Five-letter groups hiding A/B (Bacon biliteral)
- **Beaufort Cipher** - Beaufort key-table polyalphabetic cipher
- **Bifid Cipher** - Polybius square + row/column interleaving
- **Caesar Cipher** - Classic alphabet shift (configurable)
- **Columnar Transposition** - Columnar transposition with a keyword
- **Four-Square Cipher** - Four 5×5 squares; digraph substitution
- **Gronsfeld Cipher** - Vigenère family with numeric key
- **Hill Cipher** - Matrix-based multi-letter substitution
- **Homophonic Cipher** - Multiple ciphertext symbols per plaintext letter
- **Nihilist Cipher** - Keyed Polybius + additive encryption
- **Pigpen Cipher** - Masonic / pigpen grid symbols
- **Playfair Cipher** - Digraph cipher on a 5×5 square
- **Polybius Square** - Letter ↔ grid coordinates
- **Porta Cipher** - Porta table polyalphabetic cipher
- **Rail Fence** - Zig-zag rail-fence transposition
- **ROT128** - UTF-16 code unit rotation by 128
- **ROT13** - Rotate Latin letters by 13 places
- **ROT18** - Rotate printable ASCII (33–126) by 18
- **ROT47** - Rotate printable ASCII (33–126) by 47
- **ROT5** - Rotate digits 0–9 by 5
- **ROT8000** - Plane-0 Unicode BMP rotation cipher
- **Scytale Cipher** - Wrap-around strip (scytale) transposition
- **Trifid Cipher** - Three Polybius cubes + trifid grouping
- **Two-Square Cipher** - Digraph cipher with two Playfair squares
- **Vigenère Cipher** - Polyalphabetic cipher with repeating keyword
- **XOR Cipher** - XOR with a repeating key

#### **Encoding**
- **ASCII85** - Ascii85 / Adobe-style base-85 encoding
- **Base122** - Binary → 122 printable ASCII characters
- **Base32** - RFC 4648 Base32
- **Base36** - Base36 (0–9, A–Z)
- **Base45** - Base45 byte encoding
- **Base58** - Bitcoin-style Base58 (no 0/O/I/l)
- **Base62** - Base62 (0–9, A–Z, a–z)
- **Base64** - Standard Base64
- **Base64 URL** - Base64url (URL-safe alphabet)
- **Base91** - basE91 / Ascii91 encoding
- **Baudot Code (ITA2)** - Five-bit telegraph / ITA2
- **Binary Coded Decimal** - Decimal digits as BCD nibbles
- **Binary** - Text bytes ↔ binary strings
- **EBCDIC** - EBCDIC byte encoding
- **Emoji Encoding** - Payload encoded with emoji
- **Gray Code** - Binary Gray code
- **Hexadecimal** - Hex encode/decode bytes
- **HTML Entities** - HTML entity escape / unescape
- **Invisible Text** - Unicode Tags / invisible carrier encoding
- **Quoted-Printable** - MIME quoted-printable
- **Unicode Code Points** - Characters ↔ U+XXXX code points
- **URL Encode** - application/x-www-form-urlencoded
- **Uuencoding** - Classic uuencode / uudecode
- **YEnc** - yEnc line-oriented binary encoding
- **Z85** - ZeroMQ Z85 encoding

#### **Fantasy**
- **Aurebesh (Star Wars)** - Galactic Basic Aurebesh alphabet
- **Dovahzul (Dragon)** - Skyrim Dovahzul transliteration
- **Klingon** - Klingon transliteration
- **Quenya (Tolkien Elvish)** - Tolkien Quenya mapping
- **Tengwar Script** - Elvish Tengwar script

#### **Format**
- **Bitwise NOT** - UTF-8 bytes NOT'd per byte; encode output is hex (decode pastes hex back to text)
- **Boustrophedon** - Serpentine / alternating line direction
- **Capitalize Words** - Capitalize the first letter of each word
- **Indent** - Add leading spaces to each line (configurable width)
- **Javanais** - French “javanais” vowel-insertion game
- **Latin Gibberish** - Latin-flavored pseudo-text
- **Leetspeak** - 1337-style character substitutions
- **Letters Only** - Keep letters; strip other characters
- **Letters & Numbers Only** - Alphanumeric only
- **Line Numbers** - Prefix lines with numbers (start and column width configurable)
- **Louchebem** - French argot (loucherbem-style)
- **Lowercase All** - Lowercase entire text
- **Mirror Digits** - Mirror digits 0–9 visually
- **Numbers Only** - Digits only
- **Pig Latin** - English Pig Latin
- **QWERTY Right Shift** - Map keys to the key to the right on QWERTY
- **Remove Accents** - Strip diacritics / combining marks
- **Remove Consonants** - Remove consonant letters
- **Remove Duplicates** - Remove duplicate lines
- **Remove Extra Spaces** - Collapse runs of spaces
- **Remove HTML Tags** - Strip HTML/XML tags
- **Remove Newlines** - Remove line breaks
- **Remove Numbers** - Remove digit characters
- **Remove Punctuation** - Remove punctuation
- **Remove Tabs** - Remove tab characters
- **Remove Zero Width** - Strip zero-width characters
- **Reverse Words** - Reverse order of words
- **Reverse Text** - Reverse character order
- **Shuffle Characters** - Shuffle characters (random order)
- **Shuffle Words** - Shuffle word order
- **Spaces Remover** - Remove space characters
- **Text Justify** - Pad each line to a fixed width (left, right, or center); not word-spacing justify
- **Uppercase All** - Uppercase entire text
- **Toggle Case** - Swap case of each letter
- **Whitespace Steganography** - Hide bits in whitespace patterns
- **Word Wrap** - Break long lines at spaces so each line fits a maximum width
- **Zero-Width Steganography** - Hide data with zero-width characters

#### **Special**
- **Random Mix** - Pick random transforms and chain them

#### **Technical**
- **A1Z26** - A=1 … Z=26 letter numbering
- **Braille** - Unicode Braille patterns
- **Brainfuck** - Text ↔ Brainfuck program
- **ICAO Spelling Alphabet** - ICAO radiotelephony spelling
- **ITU Spelling Alphabet** - ITU phonetic / spelling alphabet
- **Maritime Signal Flags** - International maritime signal flags
- **Morse Code** - International Morse code
- **NATO Phonetic** - NATO phonetic alphabet
- **Semaphore Flags** - Flag semaphore arm positions
- **Tap Code** - Polybius / tap / prison code

#### **Unicode**
- **Bold Italic** - Mathematical sans-serif bold italic
- **Bold** - Mathematical bold
- **Bubble** - Circled / “bubble” letters
- **Chemical Symbols** - Chemical element symbols
- **Circled** - Circled Unicode letters
- **Cursive** - Mathematical script / cursive
- **Cyrillic Stylized** - Latin → Cyrillic lookalike letters
- **Dashed Underline** - Combining dashed underline
- **Dotted Underline** - Combining dotted underline
- **Double-Struck** - Mathematical double-struck
- **Fraktur** - Mathematical Fraktur / Gothic
- **Full Width** - Fullwidth Latin (and related) forms
- **Greek Letters** - Greek letter replacements
- **Hiragana** - Rough Romaji → Hiragana
- **Italic** - Mathematical italic
- **Katakana** - Rough Romaji → Katakana
- **Mathematical Notation** - Mathematical alphanumeric symbols
- **Medieval** - Medieval Unicode letterforms
- **Mirror Text** - Left–right mirrored characters
- **Monospace** - Mathematical monospace
- **Negative Squared** - Negative circled / squared letters
- **Overline** - Overline combining marks
- **Parenthesized** - Parenthesized Latin letters
- **Regional Indicator Letters** - Regional-indicator flag letters
- **Small Caps** - Small capitals (Unicode)
- **Squared** - Squared / enclosed alphanumeric
- **Strikethrough** - Strikethrough combining characters
- **Subscript** - Unicode subscripts
- **Superscript** - Unicode superscripts
- **Underline** - Underline combining characters
- **Upside Down** - Upside-down Unicode letters
- **Vaporwave** - Fullwidth + aesthetic spacing
- **Wavy Underline** - Wavy underline combining marks
- **Wide Spacing** - Insert wide spaces between characters
- **Wingdings** - Wingdings-style symbol mapping
- **Zalgo** - Stacked combining marks (“glitch” text)

#### **Visual**
- **Disemvowel** - Remove vowels (speech game)
- **Emoji Speak** - Emoji-heavy “speak” transform
- **Rövarspråket** - Swedish consonant-doubling game
- **Ubbi Dubbi** - Insert “ub” before vowel sounds

### 🛠️ **Tools** (tabs)

Tabs appear in **UI order** below. **OpenRouter** (optional or required per tool) uses the key in **Advanced Settings** — see **OpenRouter API Key Setup** below.

### 🔤 **Transform**

- **159 Transforms**: Encodings, ciphers, Unicode styles, formats, and more (full catalog above).
- **Categories**: Grouped sections you can **reorder**; quick-jump legend; **randomizer** last.
- **Favorites & last used**: Pin transforms and recall recent picks.
- **Per-transform options**: Gear icon where a transform exposes settings.
- **Keyboard shortcut**: **T** (shown in the tab title).

### 🌐 **AI Translation** (via OpenRouter)

*Lives on the **Transform** tab — not a separate tab.*

- **20+ Languages**: Major world languages (Spanish, French, Chinese, Japanese, Korean, etc.)
- **Dead & Exotic Languages**: Latin, Sanskrit, Ancient Greek, Sumerian, Akkadian, Old English, and more
- **Custom Languages**: Add any language on-the-fly
- **Multiple Models**: Gemma 3, Gemini 2.5 Flash, TranslateGemma (purpose-built translation models)
- **TranslateGemma Prompt Format**: Uses Google's optimized prompt template for high-quality translation
- **Auto-Fallback**: If a model is unavailable, automatically falls back to Gemma 3 27B

### 🔍 **Decoder** (Universal Decoder)

- **Smart detection**: Runs format detectors and decode paths for supported transforms.
- **Priority matching**: When a transform is active, decoding prefers that format first.
- **Fallback**: Tries other decoders if the primary guess fails.
- **Real-time**: Updates as you type.
- **Script & language hints**: Unicode script ranges and Latin word-marker heuristics for common languages.
- **AI translate to English** (optional, OpenRouter): When text looks foreign, optional one-shot translate to English.
- **Keyboard shortcut**: **D**.

### 😀 **Emoji** (Steganography)

- **Emoji carriers**: Hide data using variation selectors and supported emoji carriers; pick from the emoji grid.
- **Invisible text**: Switch to Unicode Tags–style invisible encoding where available.
- **Encode & decode**: Separate flows for hiding and recovering text.
- **Advanced Settings**: Bit order, VS choices, and other steganography tuning (sliders icon).
- **Keyboard shortcut**: **H** (shown in the tab title).

### 💣 **Tokenade**

- **Token bomb builder**: Depth, breadth, repeats, separators (e.g. ZWSP), variation selectors, noise.
- **Carriers & payloads**: Emoji carriers, text payloads, combining options.
- **Safety**: Warns when estimated output crosses a **danger** token threshold.

### 🧪 **Mutation Lab**

- **Batch mutations**: Generate many variants from one input (count configurable).
- **Seed**: Optional deterministic runs.
- **Toggles**: Random mix, zero-width, Unicode noise, Zalgo, whitespace, casing, encode/shuffle.
- **Random Mix**: Can chain the project’s random transform mixer when enabled.

### 📊 **Tokenizer**

- **Engines**: UTF-8 **bytes**, **words**, or **GPT BPE** (**cl100k**, **o200k**, **p50k**, **r50k**) via `gpt-tokenizer` (CDN).
- **Visualization**: Token list with IDs/pieces; **character** and **word** counts.
- **Live updates**: Re-tokenizes when input or engine changes.

### ↔️ **Bijection**

- **Custom mappings**: Character-to-number (and related) “alphapr”-style maps for research payloads.
- **Controls**: Mapping type, budget, optional examples.
- **Output**: Generated mappings and payloads ready to copy.

### ✂️ **Splitter**

- **Split modes**: By chunk size, **word**, **sentence**, **line**, **regex pattern**, or **token** count (GPT tokenizer).
- **Transform chain**: Optionally run transforms on each piece.
- **Wrapping**: Start/end templates; `{n}` iterator marker; single-line vs multiline copy.

### 💬 **Gibberish**

- **Dictionary mode**: Seeded random gibberish over a configurable character set.
- **Removal mode**: Random or **specific** letter removal with batch **variations** and min/max strip lengths.

### 🪄 **PromptCraft** (via OpenRouter)

- **9 Mutation Strategies**: Rephrase, Obfuscate, Role-Play Wrap, Multi-Language, Expand, Compress, Metaphor, Fragment, and Custom
- **48+ Models**: Frontier (Claude, GPT, Gemini, Grok), Reasoning (o3, o4, DeepSeek R1), Fast (Haiku, Mini), Code-specialized, Open Source (Llama, Qwen), and Search/Research 
models
- **Parallel Variants**: Generate 1-10 variants simultaneously with diverse temperature settings
- **Copy & iterate**: Copy any variant or feed it back as input for iterative refinement

### 🤖 **Anti-Classifier** (via OpenRouter)

- **Purpose**: Syntactic / paraphrase-style rewrites for research-style prompts.
- **Controls**: Model, temperature, max tokens.
- **Same key**: Uses the same OpenRouter API key as Translation and PromptCraft.

### 📱 **User Experience**
- **Dark/Light Theme**: Toggle between themes
- **Copy History**: Track all copied content with timestamps
- **Auto-copy**: Automatically copy transformed text
- **Keyboard Shortcuts**: Quick access to features
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Side panels**: Glitch token browser (optional data), end-sequence / delimiter strings for research, and **Advanced Settings** (OpenRouter key, steganography tuning)

### 🔑 **OpenRouter API Key Setup**

**AI Translation**, **PromptCraft**, and **Anti-Classifier** require an [OpenRouter](https://openrouter.ai/) API key. **Decoder**’s optional “translate to English” also uses OpenRouter when enabled.

1. Create an account at [openrouter.ai](https://openrouter.ai/)
2. Generate an API key (starts with `sk-or-...`)
3. In P4RS3LT0NGV3, click the **sliders icon** (top-right) to open **Advanced Settings**
4. Paste your key and click **Save Key**
5. Your key is stored locally in your browser only — never sent anywhere except OpenRouter

> **Tip:** Some models (like Gemma 3) are free on OpenRouter. Frontier models (Claude, GPT, Gemini Pro) require credits.

## 🚀 **Getting Started**

### **Quick Start (local)**
1. `npm install` then `npm run build` (generates the **`dist/`** folder — it is **not** checked into git; you must build after clone or source changes)
2. Open **`dist/index.html`** in Chrome, Firefox, Safari, or another browser (double-click the file or use **File → Open**).

**Alternative — run as a local app (npm / npx):** From the project root, after `npm install` and `npm run build`, use **`npm start`** (runs [`serve`](https://github.com/vercel/serve) on port **8080**) or **`npx serve dist -l 8080`**. Then open **http://localhost:8080** — same UI, stable URL you can bookmark. **`npm run preview`** runs a full **`npm run build`** and then serves **`dist/`** in one step.

### Agent CLI

This repo also ships a Python CLI that reuses the existing Node transform runtime without changing the static-site workflow.

```bash
uv run p4rs3lt0ngv3-cli list
uv run p4rs3lt0ngv3-cli inspect caesar --json
uv run p4rs3lt0ngv3-cli encode --transform base64 --text "Hello World"
uv run p4rs3lt0ngv3-cli decode --transform base64 --text "SGVsbG8gV29ybGQ="
uv run p4rs3lt0ngv3-cli auto-decode --text "SGVsbG8="
uv run p4rs3lt0ngv3-cli agent "encode 'Attack at dawn' as caesar shift 5"
uv run p4rs3lt0ngv3-cli /base64 Hello
uv run p4rs3lt0ngv3-cli /base64 --decode SGVsbG8=
uv run p4rs3lt0ngv3-cli /caesar --shift 5 "Attack at dawn"
```

Notes:

- The CLI is managed with **`uv`** via [`pyproject.toml`](pyproject.toml).
- It shells into Node to execute the canonical transforms under `src/transformers/`.
- Existing web build and Node test flows remain unchanged.

### **Development Setup**
```bash
# Install dependencies
npm install

# Build all assets (required before use). Order matches package.json:
# build:tools → build:copy → build:index → build:transforms → build:emoji → build:templates
npm run build

# Or build individual components:
npm run build:tools        # Auto-discover tools, inject script tags into dist/index.html
npm run build:copy         # Copy static files to dist/
npm run build:index        # Generate src/transformers/index.js (ES module index)
npm run build:transforms   # Bundle all transformers to dist/js/bundles/transforms-bundle.js
npm run build:emoji        # Generate emoji data to dist/js/data/
npm run build:templates    # Inject tool HTML templates into dist/index.html

# Run tests
npm test                   # Run universal decoder tests
npm run test:universal     # Same as above
npm run test:steg          # Test steganography options
npm run test:all           # Universal + steganography tests

# Optional: serve dist/ over HTTP instead of opening dist/index.html directly
npm start                  # http://localhost:8080
npm run preview            # npm run build, then serve dist/
```

### **Documentation & maintainer notes**

| Doc | Purpose |
|-----|---------|
| [CONTRIBUTING.md](CONTRIBUTING.md) | Adding transformers, tools, tests |
| [docs/TOOL-SYSTEM.md](docs/TOOL-SYSTEM.md) | Tool templates, build injection, shared UI classes |
| [build/README.md](build/README.md) | What each `build:*` script does |
| [templates/README.md](templates/README.md) | Editing tool HTML templates |

**Keeping the transform list in this README in sync:** when you add or rename a transformer, add a one-line description to `DESCRIPTIONS` in `build/readme-transform-section.js`, run `node build/readme-transform-section.js`, and replace the **Text Transformations** section here (details in [src/transformers/README.md](src/transformers/README.md)).

## 🛠️ **Technical Details**

### **Architecture**
- **Frontend**: Vue.js 2.6 with modern CSS (staying on Vue 2)
- **Tool System**: Modular tool registry with build-time template injection
- **Encoding**: UTF-8 with proper Unicode handling
- **Steganography**: Variation selectors and Tags Unicode block
- **Transforms**: Individual transformer modules live under `src/transformers/` (159; the bundle is generated by `npm run build:transforms`)
- **Build Process**: 
  - `npm run build` writes the runnable app under `dist/` (ignored by git in most setups)
  - Transformers are bundled from `src/transformers/` to `dist/js/bundles/transforms-bundle.js`
  - Tool templates are injected from `templates/` into `dist/index.html`
  - Emoji data is generated to `dist/js/data/`

### **Browser Support**
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS 13+, Android 8+)

### **Performance**
- **Real-time Processing**: < 16ms for most transforms
- **Memory Efficient**: Streams large text without loading into memory
- **Optimized Rendering**: Efficient DOM updates with Vue.js

## 🔧 **Recent Fixes & Improvements**

### **Fixed Issues**
- ✅ **Duplicate Transform**: Removed duplicate `invisible_text` transform
- ✅ **Base32 Implementation**: Fixed encoding/decoding with proper byte handling
- ✅ **Unicode Support**: Improved handling of complex Unicode characters
- ✅ **Reverse Functions**: Added missing reverse functions for many transforms

### **New Features**
- 🆕 **AI Translation**: Translate to 20+ languages (including dead/exotic) via OpenRouter using TranslateGemma prompt format
- 🆕 **PromptCraft Tool**: AI-powered prompt mutation with 9 strategies and 48+ models
- 🆕 **OpenRouter Integration**: Unified API key management for all AI-powered features
- 🆕 **159 Transformations**: Full catalog of encodings, ciphers, Unicode styles, fantasy and ancient scripts, and technical codes (see README transform list)
- 🆕 **More Encodings/Ciphers**: Base58, Base62, Vigenère, Rail Fence, Roman Numerals
- 🆕 **Category Organization**: Better organized transform categories
- 🆕 **Enhanced Styling**: New color schemes for each category
- 🆕 **Improved Decoder**: Better detection and fallback mechanisms

## 🌟 **Use Cases**

### **Creative Writing**
- Create unique text styles for stories
- Encode secret messages in plain sight
- Generate fantasy language text

### **Education**
- Learn about different writing systems
- Study cryptography and encoding
- Explore linguistic diversity

### **Security**
- Hide sensitive information
- Create steganographic messages
- Test encoding/decoding systems

### **Entertainment**
- Create puzzles and games
- Generate unique usernames
- Add flair to social media posts

## 🤝 **Contributing**

This project welcomes contributions! See **[CONTRIBUTING.md](CONTRIBUTING.md)** for detailed guidelines.

**Quick Start:**
- **Adding a transformer?** See `src/transformers/` directory structure
- **Adding a new tool/feature?** See `CONTRIBUTING.md` → "Adding a New Tool"
- **Adding utilities?** See `CONTRIBUTING.md` → "Adding a New Utility Function"
- **Editing tool templates?** See `templates/README.md`

**Areas for improvement:**
- **New Languages**: Add more fictional or historical scripts
- **Better Decoding**: Improve universal decoder accuracy
- **Performance**: Optimize for very long texts
- **Mobile**: Enhance mobile experience
- **Accessibility**: Improve screen reader support

## 📄 **License**

This project is open source. See LICENSE file for details.

## 🙏 **Acknowledgments**

- **J.R.R. Tolkien** for Quenya and Tengwar
- **Star Trek** creators for Klingon language
- **Star Wars** creators for Aurebesh
- **Bethesda** for Dovahzul language
- **Unicode Consortium** for character standards
- **Apogee Software / Commander Keen / Tom Hall** creator of Standard Galactic Alphabet, used in Minecraft Enchanting Table

---

**P4RS3LT0NGV3** - Because sometimes you need to speak in tongues that don't exist! 🐉✨
