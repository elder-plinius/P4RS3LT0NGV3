# 🐍 P4RS3LT0NGV3 4.0 — Universal Text Translator

A powerful web-based text transformation and steganography tool with **222** built-in text transforms spanning encodings, classical and modern ciphers, Unicode styles, formatting, and niche alphabets. Think of it as a universal translator for ALL alphabets and writing systems!

**Version 4.0** brings a redesigned desktop app shell, seven themes (including WCAG 2.1 AA **Accessible**), mobile utility panels, OpenRouter model curation, and responsive UI polish across all tools.

The app is a **static site**: run **`npm run build`** (after `npm install`), then open **`dist/index.html`** in your browser—no local server required. **Alternatively**, you can run it as a local app over HTTP with **`npm start`** or **`npx serve dist -l 8080`** (see [Getting Started](#getting-started) below). Core transforms, decoder, and steganography work **without** calling the cloud; the AI-assisted features work with **any supported provider** — [OpenRouter](https://openrouter.ai/), OpenAI, Anthropic, Google Gemini, [audn.ai](https://audn.ai/), or any OpenAI-compatible custom endpoint — and need **network access** plus an API key for at least one provider (see [AI Providers & API Keys](#-ai-providers--api-keys) below).

## ✨ Features

### 🔐 **Steganography**
- **Emoji Steganography**: Hide messages within emojis using variation selectors (VS15/VS16 and related options; configurable bit order in Advanced Settings)
- **Invisible Text**: Encode text using Unicode Tags block (visually invisible)
- **Whitespace & zero-width steganography**: Available as transforms for research-style payloads (see transform categories)

### 🌍 **Text Transformations**

Categories match the Transform tab and the folders under `src/transformers/` (each transformer’s `name` as shown in the UI). Short descriptions explain what each transform does.

#### **Case**
- **Alternating Case** - Alternate uppercase and lowercase per letter (first letter upper or lower)
- **camelCase** - lowerCamelCase for identifiers
- **Capitalize Words** - Capitalize the first letter of each word
- **kebab-case** - kebab-case for slugs and identifiers
- **Lowercase All** - Lowercase entire text
- **Random Case** - Random casing per character
- **Sentence Case** - Capitalize the first letter of each sentence
- **snake_case** - snake_case for identifiers
- **Title Case** - Capitalize each word
- **Toggle Case** - Swap case of each letter
- **Uppercase All** - Uppercase entire text

#### **Cipher**
- **A1Z26** - A=1 … Z=26 letter numbering
- **Acéré Cipher** - Solfege / duration encoding for musical steganography
- **ADFGX Cipher** - WWI ADFGVX-style polybius + column transposition
- **Affine Cipher** - Affine substitution (ax + b mod 26)
- **Atbash Cipher** - Reverse-alphabet substitution (A↔Z)
- **Autokey Cipher** - Key stream mixed with plaintext (autokey)
- **Baconian Cipher** - Five-letter groups hiding A/B (Bacon biliteral)
- **Beaufort Cipher** - Beaufort key-table polyalphabetic cipher
- **Bifid Cipher** - Polybius square + row/column interleaving
- **Caesar Cipher** - Classic alphabet shift (configurable)
- **Codons (Genetic Code)** - Letters A–Z as DNA triplets
- **Columnar Transposition** - Columnar transposition with a keyword
- **Double Transposition** - Two keyed columnar transpositions
- **Four-Square Cipher** - Four 5×5 squares; digraph substitution
- **Fractionated Morse** - Morse with fractionation pattern
- **Gronsfeld Cipher** - Vigenère family with numeric key
- **Hill Cipher** - Matrix-based multi-letter substitution
- **Homophonic Cipher** - Multiple ciphertext symbols per plaintext letter
- **Multiplicative Cipher** - Multiply by key mod 26
- **Nihilist Cipher** - Keyed Polybius + additive encryption
- **Playfair Cipher** - Digraph cipher on a 5×5 square
- **Polybius Square** - Letter ↔ grid coordinates
- **Porta Cipher** - Porta table polyalphabetic cipher
- **QWERTY Right Shift** - Map keys to the key to the right on QWERTY
- **Route Cipher** - Read ciphertext along a grid route
- **Rail Fence** - Zig-zag rail-fence transposition
- **ROT128** - UTF-16 code unit rotation by 128
- **ROT13** - Rotate Latin letters by 13 places
- **ROT18** - Rotate printable ASCII (33–126) by 18
- **ROT47** - Rotate printable ASCII (33–126) by 47
- **ROT5** - Rotate digits 0–9 by 5
- **ROT8000** - Plane-0 Unicode BMP rotation cipher
- **Scytale Cipher** - Wrap-around strip (scytale) transposition
- **Tap Code** - Polybius / tap / prison code
- **Trifid Cipher** - Three Polybius cubes + trifid grouping
- **Trithemius Cipher** - Progressive Caesar (tabula recta)
- **Two-Square Cipher** - Digraph cipher with two Playfair squares
- **Vernam Cipher** - One-time pad XOR (mod 26)
- **Vigenère Cipher** - Polyalphabetic cipher with repeating keyword
- **XOR Cipher** - XOR with a repeating key

#### **Concealment**
- **Acrostic** - First letter of each line or word spells a message
- **Cardan Grille** - Hide text through a rotating grille
- **Homoglyph Generator** - Latin letters to Cyrillic homoglyphs
- **Invisible Text** - Unicode Tags / invisible carrier encoding
- **Null Cipher** - Fixed letter position in each cover word
- **Trevanion Cipher** - Letters N positions after punctuation marks
- **Whitespace Steganography** - Hide bits in whitespace patterns
- **Zero-Width Steganography** - Hide data with zero-width characters

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
- **Bibi-binary Code** - UTF-8 bytes via Bibi-binary syllables
- **Baudot Code (ITA2)** - Five-bit telegraph / ITA2
- **Binary Coded Decimal** - Decimal digits as BCD nibbles
- **Binary** - Text bytes ↔ binary strings
- **Bitwise NOT** - UTF-8 bytes NOT'd per byte; encode output is hex (decode pastes hex back to text)
- **Brainfuck** - Text ↔ Brainfuck program
- **Decabit Code** - Ten-bit patterns for decimal digits
- **EBCDIC** - EBCDIC byte encoding
- **Base256Emoji** - Multiformats multibase encoding (1 byte → 1 emoji)
- **Gray Code** - Binary Gray code
- **Hexadecimal** - Hex encode/decode bytes
- **HTML Entities** - HTML entity escape / unescape
- **Manchester Code** - Manchester line coding
- **Metaphone** - Metaphone phonetic encoding
- **Quoted-Printable** - MIME quoted-printable
- **Shadoks Numeral System** - UTF-8 bytes as Shadoks base-4 words
- **Unicode Code Points** - Characters ↔ U+XXXX code points
- **URL Encode** - application/x-www-form-urlencoded
- **Uuencoding** - Classic uuencode / uudecode
- **YEnc** - yEnc line-oriented binary encoding
- **Z85** - ZeroMQ Z85 encoding

#### **Format**
- **Boustrophedon** - Serpentine / alternating line direction
- **Group Letters** - Insert separators between letters
- **Indent** - Add leading spaces to each line (configurable width)
- **Letters Only** - Keep letters; strip other characters
- **Letters & Numbers Only** - Alphanumeric only
- **Line Numbers** - Prefix lines with numbers (start and column width configurable)
- **Leading Zeros** - Pad numbers with leading zeros
- **List Deduplicate** - Remove duplicate lines from a list
- **Mirror Digits** - Mirror digits 0–9 visually
- **Numbers Only** - Digits only
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
- **Shuffled Letters** - Randomize letter order within each word
- **Spaces Remover** - Remove space characters
- **Text Justify** - Pad each line to a fixed width (left, right, or center); not word-spacing justify
- **Typoglycemia** - Scrambled middle letters (readable chaos)
- **Word Letter Add** - Insert a letter at a fixed position in each word
- **Word Letter Change** - Replace a letter at a fixed position in each word
- **Word Letter Remove** - Remove a letter at a fixed position in each word
- **Word Wrap** - Break long lines at spaces so each line fits a maximum width

#### **SignWriting**
- **ASL SignWriting** - American Sign Language fingerspelling (ISWA)
- **LIBRAS SignWriting** - Brazilian Sign Language fingerspelling
- **JSL SignWriting** - Japanese Sign Language (hiragana input)
- **IPA Lip-reading** - IPA symbols in SignWriting
- **Morse Blink** - Morse as SignWriting blink marks
- **Tactile SignWriting** - Tactile SignWriting notation

#### **Special**
- **Random Mix** - Pick random transforms and chain them

#### **Technical**
- **ICAO Spelling Alphabet** - ICAO radiotelephony spelling
- **ITU Spelling Alphabet** - ITU phonetic / spelling alphabet
- **DTMF Tones** - Dual-tone multi-frequency telephone codes
- **Maritime Signal Flags** - International maritime signal flags
- **Morse Code** - International Morse code
- **Navajo Code** - WWII Navajo word code for A–Z
- **NATO Phonetic** - NATO phonetic alphabet
- **Semaphore Flags** - Flag semaphore arm positions
- **T9 (Predictive Text)** - Phone T9 multi-tap encoding
- **Phone Keypad** - Digits from phone keypad groups

#### **Symbol**
- **Alchemical Symbols** - Alchemical symbol alphabet
- **Aurebesh (Star Wars)** - Galactic Basic Aurebesh alphabet
- **Babylonian Numerals** - A1Z26 as cuneiform numerals
- **Braille** - Unicode Braille patterns
- **Celestial Alphabet** - Celestial / angelic script
- **Chemical Symbols** - Chemical element symbols
- **Daedric (Elder Scrolls)** - Daedric alphabet
- **Dancing Men (Sherlock Holmes)** - Dancing figure cipher
- **Dominos in Digits** - Digits as domino tile notation
- **Dovahzul (Dragon)** - Skyrim Dovahzul transliteration
- **Egyptian Numerals** - A1Z26 as hieroglyph numerals
- **Elder Futhark** - Germanic Elder Futhark runes
- **Enochian** - Enochian angelic alphabet
- **Eye of Horus (Wedjat)** - Wedjat fraction hieroglyphs
- **Friderici Cipher (Windows)** - 1685 window-pane cipher
- **Greek Letters** - Greek letter replacements
- **Hieroglyphics** - Egyptian hieroglyph-style mapping
- **Hiragana** - Rough Romaji → Hiragana
- **Klingon** - Klingon transliteration
- **Katakana** - Rough Romaji → Katakana
- **Malachim** - Malachim angelic alphabet
- **Mary Stuart Cipher** - Mary Queen of Scots cipher
- **Mayan Numerals** - A1Z26 as Mayan numeral glyphs
- **Moon Alphabet** - Moon type for blind readers
- **Ogham (Celtic)** - Celtic Ogham tree alphabet
- **Passing the River** - Golden Dawn Passing the River script
- **Periodic Table Cipher** - Letters A–Z as element symbols
- **Pigpen Cipher** - Masonic / pigpen grid symbols
- **Quenya (Tolkien Elvish)** - Tolkien Quenya mapping
- **Roman Numerals** - Arabic numerals ↔ Roman numerals
- **Rosicrucian** - Rosicrucian cipher alphabet
- **Seven-Segment Display** - Digits as 7-segment ASCII art
- **Standard Galactic (Minecraft)** - Enchanting Table / SGA alphabet
- **Templars Cipher** - Templar pigpen variant
- **Tengwar Script** - Elvish Tengwar script
- **Theban Alphabet** - Witches' Theban script
- **Wingdings** - Wingdings-style symbol mapping
- **Younger Futhark** - Medieval Younger Futhark runes

#### **Unicode**
- **Bold Italic** - Mathematical sans-serif bold italic
- **Bold** - Mathematical bold
- **Bubble** - Circled letters (upper and lower case) and circled digits 0–9
- **Circled** - Circled uppercase letters and digits (no lowercase)
- **Cursive** - Mathematical script / cursive
- **Cyrillic Stylized** - Latin → Cyrillic lookalike letters
- **Dashed Underline** - Combining dashed underline
- **Dotted Underline** - Combining dotted underline
- **Double-Struck** - Mathematical double-struck
- **Fraktur** - Mathematical Fraktur / Gothic
- **Full Width** - Fullwidth Latin (and related) forms
- **Italic** - Mathematical italic
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
- **Zalgo** - Stacked combining marks (“glitch” text)

#### **Visual**
- **Disemvowel** - Remove vowels (speech game)
- **Emoji Speak** - Emoji-heavy “speak” transform
- **Javanais** - French “javanais” vowel-insertion game
- **Latin Gibberish** - Latin-flavored pseudo-text
- **Leetspeak** - 1337-style character substitutions
- **Louchebem** - French argot (loucherbem-style)
- **Pig Latin** - English Pig Latin
- **Rövarspråket** - Swedish consonant-doubling game
- **Ubbi Dubbi** - Insert “ub” before vowel sounds

### 🛠️ **Tools** (tabs)

Tabs appear in **UI order** below. AI-backed tools use whichever **AI provider** you've configured in **Advanced Settings** — you can pick any model across every provider you've added a key for — see [AI Providers & API Keys](#-ai-providers--api-keys) below.

### 🔤 **Transform**

- **222 Transforms**: Encodings, ciphers, Unicode styles, formats, and more (full catalog above).
- **Categories**: Grouped sections you can **reorder**; quick-jump legend; **randomizer** last.
- **Favorites & last used**: Pin transforms and recall recent picks.
- **Per-transform options**: Gear icon where a transform exposes settings.
- **Keyboard shortcut**: **T** (shown in the tab title).

### 🌐 **AI Translation** (AI-powered)

*Lives on the **Transform** tab — not a separate tab.*

- **20+ Languages**: Major world languages (Spanish, French, Chinese, Japanese, Korean, etc.)
- **Dead & Exotic Languages**: Latin, Sanskrit, Ancient Greek, Sumerian, Akkadian, Old English, and more
- **Custom Languages**: Add any language on-the-fly
- **Any configured model**: Pick from every provider you've set up (OpenRouter, OpenAI, Anthropic, Google, audn.ai, custom); translation models like Gemma 3 / TranslateGemma still work great here
- **TranslateGemma Prompt Format**: Uses Google's optimized prompt template for high-quality translation
- **Auto-Fallback**: If a model is unavailable, automatically falls back to Gemma 3 27B

### 🔍 **Decoder** (Universal Decoder)

- **Smart detection**: Runs format detectors and decode paths for supported transforms.
- **Priority matching**: When a transform is active, decoding prefers that format first.
- **Fallback**: Tries other decoders if the primary guess fails.
- **Real-time**: Updates as you type.
- **Script & language hints**: Unicode script ranges and Latin word-marker heuristics for common languages.
- **AI translate to English** (optional, AI-powered): When text looks foreign, optional one-shot translate to English via your chosen provider.
- **Deep link**: `#decoder` in the URL opens this tab directly.

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

### 🔤 **Spelling Alphabets**

- **Custom ICAO-style alphabets**: One word per letter A–Z, like NATO/ICAO phonetic spelling.
- **AI generate (optional)**: Enter a category/theme and generate a full alphabet with any configured provider/model; edit any letter before saving.
- **Manual mode**: No API key required — fill in all 26 letters yourself.
- **Saved locally**: Alphabets persist in browser `localStorage` as JSON.
- **Transforms integration**: Each saved alphabet appears on the Transforms page under `custom_spelling`.

### 💬 **Gibberish**

- **Dictionary mode**: Seeded random gibberish over a configurable character set.
- **Removal mode**: Random or **specific** letter removal with batch **variations** and min/max strip lengths.

### 📷 **Codes** (QR & barcodes)

*Tab id: `codes` — deep link: `#codes` (generate) or `#codes/decode` (scan).*

- **Generate**: QR codes and common 1D barcodes from any text or numeric payload.
- **Formats**: **QR Code** (PNG download), **Code 128**, **EAN-13**, and **Code 39** (SVG download).
- **QR options**: Pixel size, quiet-zone margin, and error-correction level (L / M / Q / H).
- **Barcode options**: Bar height, module width, and optional human-readable label under the bars.
- **Decode**: Upload a PNG, JPEG, GIF, or WebP image to read QR codes and barcodes — **fully client-side** (image never leaves the browser).
- **Copy & reuse**: Send decoded text to the Generate tab with one click.
- **Offline-friendly**: QR/barcode libraries (`qrcode`, JsBarcode, ZXing) are bundled into `js/vendor/` at build time — no runtime CDN for this tab.

### 🪄 **PromptCraft** (AI-powered)

- **9 Mutation Strategies**: Rephrase, Obfuscate, Role-Play Wrap, Multi-Language, Expand, Compress, Metaphor, Fragment, and Custom
- **Models from every provider**: Frontier (Claude, GPT, Gemini, Grok), Reasoning (o3, o4, DeepSeek R1), Fast (Haiku, Mini), Code-specialized, Open Source (Llama, Qwen) — from OpenRouter plus any OpenAI/Anthropic/Google/audn.ai/custom key you've added, all in one dropdown
- **Parallel Variants**: Generate 1-10 variants simultaneously with diverse temperature settings
- **Copy & iterate**: Copy any variant or feed it back as input for iterative refinement

### 🤖 **Anti-Classifier** (AI-powered)

- **Purpose**: Syntactic / paraphrase-style rewrites for research-style prompts.
- **Controls**: Model, temperature, max tokens.
- **Shared providers**: Uses the same configured AI providers/keys as Translation and PromptCraft; pick any model from the unified dropdown.

### 📱 **User Experience**
- **Themes**: **Advanced Settings** → Theme (Dark, Light, **Accessible**, BT6, Pliny, Cyberpunk, Wild West) — press **`D`** to cycle; choice saved in the browser
- **Desktop layout**: Left tool nav, main workspace, right utility dock (Copy History, Glitch Tokens, End Sequences, Advanced Settings)
- **Mobile / narrow screens**: Tool picker dropdown; utility panels slide in from the right (open via the **columns** icon in the header)
- **Copy History**: Track all copied content with timestamps
- **Auto-copy**: Automatically copy transformed text (where enabled per tool)
- **Keyboard Shortcuts**: Quick access to features (including **`D`** for theme cycle)
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Side panels**: Glitch token browser (optional data), end-sequence / delimiter strings for research, and **Advanced Settings** (AI provider keys, model selection/curation, steganography tuning)
- **Deep links**: Open a specific tool tab via URL hash — e.g. `#decoder`, `#steganography`, `#codes`, `#codes/decode` (browser back/forward supported)

Contributors: see **[docs/THEMES.md](docs/THEMES.md)** for how to add or edit themes.

### 🔑 **AI Providers & API Keys**

**AI Translation**, **PromptCraft**, **Anti-Classifier**, and **Spelling Alphabets** (optional generate) call a cloud AI provider. **Decoder**’s optional “translate to English” does too when enabled. The Spelling Alphabets tool works fully without a key if you enter letters manually.

The AI backend is **multi-provider**: configure as many providers as you like at once, each with its own key, and pick any model across all of them from a single dropdown — there is **no "active provider" to switch between**. The model you choose determines which provider (and key) the request uses.

**Built-in providers:**

| Provider | Key format | Notes |
|----------|-----------|-------|
| [OpenRouter](https://openrouter.ai/) | `sk-or-...` | Hundreds of models; curate which appear in dropdowns |
| [OpenAI](https://platform.openai.com/) | `sk-...` | gpt-5, o3, gpt-4.1, … |
| [Anthropic](https://console.anthropic.com/) | `sk-ant-...` | Claude Opus / Sonnet / Haiku |
| [Google Gemini](https://aistudio.google.com/) | `AIza...` | Gemini 2.5 Pro/Flash, Gemma (OpenAI-compatible endpoint) |
| [audn.ai](https://audn.ai/) | `sk_live_...` | |
| **Custom** | any | Add any **OpenAI-compatible** or **Anthropic Messages** endpoint by base URL |

**Setup:**

1. Create an account with whichever provider(s) you want and generate an API key.
2. In P4RS3LT0NGV3, open **Advanced Settings** from the utility dock (desktop) or the **columns** icon in the header (mobile).
3. Paste each provider's key and save it. Add a **Custom** provider by entering a name, base URL, wire format (OpenAI-compatible or Anthropic), and key.
4. Models are **fetched live** from each configured provider (cached ~1h); if a provider has no listable models the app falls back to a sensible built-in list. Curate/pick which models appear in the dropdowns.
5. Choose a model in any AI tool — the correct provider and key are resolved automatically.

**Auto-adapting requests:** the app learns each model's request dialect from its own error responses, so it "just works" across providers — e.g. newer OpenAI models that require `max_completion_tokens` instead of `max_tokens`, and reasoning models that reject a non-default `temperature`, are handled transparently and remembered.

> **Privacy:** keys are stored **locally in your browser only** and are sent solely to the provider that owns the model you pick.
>
> **Tip:** Some models (like Gemma 3 on OpenRouter/Google) are free. Frontier models (Claude, GPT, Gemini Pro) require credits with their provider.

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
# build:tools → build:codes-vendor → build:copy → build:index → build:transforms → build:emoji → build:templates
npm run build

# Or build individual components:
npm run build:tools        # Auto-discover tools, inject script tags into dist/index.html
npm run build:codes-vendor # Bundle qrcode, JsBarcode, ZXing → dist/js/vendor/
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

**Keeping the transform list in this README in sync:** when you add, rename, or move a transformer, update the **Text Transformations** section below manually — one bullet per transform under the correct category heading (`case`, `cipher`, `concealment`, `encoding`, `format`, `signwriting`, `special`, `symbol`, `technical`, `unicode`, `visual`). Use the transform’s UI `name` and a short description. Category comes from the folder under `src/transformers/` (see [src/transformers/README.md](src/transformers/README.md)).

## 🛠️ **Technical Details**

### **Architecture**
- **Frontend**: Vue.js 2.6 with modern CSS (staying on Vue 2)
- **Tool System**: Modular tool registry with build-time template injection
- **Encoding**: UTF-8 with proper Unicode handling
- **Steganography**: Variation selectors and Tags Unicode block
- **Transforms**: Individual transformer modules live under `src/transformers/` (222; the bundle is generated by `npm run build:transforms`)
- **Build Process**: 
  - `npm run build` writes the runnable app under `dist/` (ignored by git in most setups)
  - Transformers are bundled from `src/transformers/` to `dist/js/bundles/transforms-bundle.js`
  - Tool templates are injected from `templates/` into `dist/index.html`
  - Emoji data is generated to `dist/js/data/`
  - QR/barcode vendors (`qrcode`, `JsBarcode`, `@zxing/library`) are bundled to `dist/js/vendor/` via `npm run build:codes-vendor`

### **Browser Support**
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS 13+, Android 8+)

### **Performance**
- **Real-time Processing**: < 16ms for most transforms
- **Memory Efficient**: Streams large text without loading into memory
- **Optimized Rendering**: Efficient DOM updates with Vue.js

## 🔧 **What's New in 4.0**

- 🆕 **Version 4.0 release**: Major UI refresh — desktop three-column layout, theme system, and mobile utility dock
- 🆕 **Theme system**: Seven themes (Dark, Light, **Accessible**, BT6, Pliny, Cyberpunk, Wild West) with token-based CSS and atmosphere layers
- 🆕 **Desktop app shell**: Left tool nav, main workspace, right utility dock (Copy History, Glitch Tokens, End Sequences, Settings)
- 🆕 **Mobile utility panels**: Slide-over panels with responsive tab bar (no horizontal scroll)
- 🆕 **OpenRouter model settings**: Curate which models appear in AI tool dropdowns (Settings)
- 🆕 **Responsive tool polish**: Bijection, Tokenade, transform cards, and topbar layout improvements

## 🔧 **Recent Fixes & Improvements**

### **Fixed Issues**
- ✅ **Duplicate Transform**: Removed duplicate `invisible_text` transform
- ✅ **Base32 Implementation**: Fixed encoding/decoding with proper byte handling
- ✅ **Unicode Support**: Improved handling of complex Unicode characters
- ✅ **Reverse Functions**: Added missing reverse functions for many transforms

### **New Features**
- 🆕 **Multi-provider AI**: Configure OpenRouter, OpenAI, Anthropic, Google Gemini, audn.ai, and custom OpenAI-compatible/Anthropic endpoints at once — each with its own key — and pick any model across all of them from one dropdown (no "active provider" to switch)
- 🆕 **Live model catalogs**: Models are fetched from each configured provider's API (cached), with graceful fallback to built-in lists
- 🆕 **Auto-adapting requests**: Learns each model's parameter dialect from its errors (e.g. `max_completion_tokens` vs `max_tokens`, reasoning-model `temperature` limits) so requests succeed across providers without hardcoding
- 🆕 **Codes tool**: Generate QR codes and barcodes (Code 128, EAN-13, Code 39); decode from uploaded images client-side
- 🆕 **URL deep links**: Jump to any tool tab with `#tab` hashes (e.g. `#codes/decode`)
- 🆕 **AI Translation**: Translate to 20+ languages (including dead/exotic) using the TranslateGemma prompt format
- 🆕 **PromptCraft Tool**: AI-powered prompt mutation with 9 strategies across every configured provider
- 🆕 **222 Transformations**: Full catalog of encodings, ciphers, Unicode styles, symbol alphabets, SignWriting, and technical codes (see README transform list)
- 🆕 **More Encodings/Ciphers**: Base58, Base62, Vigenère, Rail Fence, Roman Numerals
- 🆕 **Category Organization**: Better organized transform categories
- 🆕 **Enhanced Styling**: New color schemes for each category
- 🆕 **Improved Decoder**: Better detection and fallback mechanisms

## 🌟 **Use Cases**

### **Creative Writing**
- Create unique text styles for stories
- Encode secret messages in plain sight
- Generate symbolic or script-style text

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
- **[RaidedCluster](https://github.com/RaidedCluster)** — SignWriting transforms

---

**P4RS3LT0NGV3 4.0** - Because sometimes you need to speak in tongues that don't exist! 🐉✨
