# 🐍 P4RS3LT0NGV3 - Universal Text Translator

A powerful web-based text transformation and steganography tool that can encode/decode text in 79+ different languages, scripts, and formats. Think of it as a universal translator for ALL alphabets and writing systems!

## ✨ Features

### 🔐 **Steganography**
- **Emoji Steganography**: Hide messages within emojis using variation selectors
- **Invisible Text**: Encode text using Unicode Tags block (completely invisible)
- **Image Steganography**: Hide messages in images using LSB techniques

### 🌍 **Text Transformations**

#### **Encoding & Decoding**
- **Base64** - Standard base64 encoding/decoding
- **Base32** - RFC 4648 compliant base32 encoding/decoding  
- **Base58** - Bitcoin alphabet encoding/decoding
- **Base62** - 0-9A-Za-z compact encoding/decoding
- **Binary** - Convert text to/from binary representation
- **Hexadecimal** - Convert text to/from hex format
- **ASCII85** - Advanced ASCII85 encoding/decoding
- **URL Encode** - URL-safe encoding/decoding
- **HTML Entities** - HTML entity encoding/decoding

#### **Ciphers & Codes**
- **Caesar Cipher** - Classic shift cipher with configurable offset
- **ROT13** - Simple rotation cipher
- **ROT47** - Extended rotation cipher for ASCII 33-126
- **Morse Code** - International Morse code with proper spacing
- **NATO Phonetic** - NATO phonetic alphabet
- **Vigenère Cipher** - Polyalphabetic cipher (default key "KEY")
- **Rail Fence (3 Rails)** - Zig-zag transposition cipher

#### **Visual Transformations**
- **Upside Down** - Flip text upside down using Unicode characters
- **Full Width** - Convert to full-width Unicode characters
- **Small Caps** - Convert to small capital letters
- **Bubble Text** - Enclose letters in circles
- **Braille** - Convert to Braille patterns
- **Strikethrough** - Add strikethrough using combining characters
- **Underline** - Add underlines using combining characters

#### **Unicode Styles**
- **Medieval** - Gothic/medieval style characters
- **Cursive** - Cursive/script style characters  
- **Monospace** - Monospace mathematical characters
- **Double-Struck** - Mathematical double-struck characters
- **Greek Letters** - Greek alphabet characters
- **Wingdings** - Symbol font characters
- **Fraktur** - Mathematical Fraktur alphabet
- **Cyrillic Stylized** - Latin letters mapped to similar Cyrillic glyphs
- **Katakana** - Romaji to Katakana (approximate, reversible)
- **Hiragana** - Romaji to Hiragana (approximate, reversible)
- **Roman Numerals** - Numbers to Roman numerals (reversible)

#### **Fantasy Languages** 🧙‍♂️
- **Quenya (Tolkien Elvish)** - High Elvish language from Lord of the Rings
- **Tengwar Script** - Elvish writing system
- **Klingon** - Star Trek Klingon language
- **Aurebesh (Star Wars)** - Galactic Basic alphabet
- **Dovahzul (Dragon)** - Dragon language from Skyrim

#### **Ancient Scripts** 🏛️
- **Elder Futhark** - Ancient Germanic runes
- **Hieroglyphics** - Egyptian hieroglyphic symbols
- **Ogham (Celtic)** - Celtic tree alphabet
- **Semaphore Flags** - Flag signaling system

#### **Technical Codes** ⚙️
- **Brainfuck** - Esoteric programming language
- **Mathematical Notation** - Mathematical script characters
- **Chemical Symbols** - Chemical element abbreviations

#### **Formatting**
- **Pig Latin** - Simple word transformation
- **Leetspeak** - 1337 speak with number substitutions
- **Vaporwave** - Aesthetic spacing
- **Zalgo** - Glitch text with combining marks
- **Mirror Text** - Reversed text

### 🔍 **Universal Decoder**
- **Smart Detection**: Automatically detects and decodes any supported format
- **Priority Matching**: Prioritizes decoding based on active transform
- **Fallback Methods**: Tries all available decoders if primary fails
- **Real-time Processing**: Instant decoding as you type

### 🛠️ **Available Tools**
- **Universal Decoder**: Auto-detect and decode any supported format
- **Text Transforms**: 79+ encoding, cipher, and transformation options
- **Steganography**: Emoji and invisible text steganography
- **Tokenade Generator**: High-density token payload builder
- **Mutation Lab (Fuzzer)**: Generate diverse text mutations
- **Tokenizer Visualization**: Visualize tokenization for various engines
- **Message Splitter**: Split text into multiple copyable chunks
- **Gibberish Generator**: Create gibberish dictionaries and character removal variants

### 📱 **User Experience**
- **Dark/Light Theme**: Toggle between themes
- **Copy History**: Track all copied content with timestamps
- **Auto-copy**: Automatically copy transformed text
- **Keyboard Shortcuts**: Quick access to features
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 🚀 **Getting Started**

### **Quick Start (Built Version)**
1. Run the build process (see Development Setup below)
2. Open `dist/index.html` in any modern web browser
3. Type text in the input field
4. Choose a transformation from the categorized buttons
5. Click any transform button to apply and auto-copy
6. Use the Universal Decoder to decode any encoded text

### **Development Setup**
```bash
# Install dependencies
npm install

# Build all assets (required before use):
# - Copies static files to dist/
# - Builds transform bundle from source files
# - Generates emoji data
# - Injects tool templates into dist/index.html
npm run build

# Or build individual components:
npm run build:copy         # Copy static files to dist/
npm run build:transforms   # Bundle all transformers to dist/js/bundles/
npm run build:emoji        # Generate emoji data to dist/js/data/
npm run build:templates    # Inject tool HTML templates to dist/index.html
npm run build:index        # Generate transformer index

# Run tests
npm test                   # Run universal decoder tests
npm run test:universal     # Same as above
npm run test:steg          # Test steganography options
```


## 🛠️ **Technical Details**

### **Architecture**
- **Frontend**: Vue.js 2.6 with modern CSS (staying on Vue 2)
- **Tool System**: Modular tool registry with build-time template injection
- **Encoding**: UTF-8 with proper Unicode handling
- **Steganography**: Variation selectors and Tags Unicode block
- **Build Process**: 
  - Transformers are bundled from `src/transformers/` into `js/bundles/transforms-bundle.js`
  - Tool templates are injected from `templates/` into `index.html`
  - Emoji data is generated from Unicode specifications
  - All build steps are required before the app can run

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
- 🆕 **79+ Transformations**: Added fantasy, ancient, and technical scripts
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
