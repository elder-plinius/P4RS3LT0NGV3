# 🐍 P4RS3LT0NGV3 - Universal Text Translator

A powerful web-based text transformation and steganography tool that can encode/decode text in over 50 different languages, scripts, and formats. Think of it as a universal translator for ALL alphabets and writing systems!

https://elder-plinius.github.io/P4RS3LT0NGV3/

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
- **Rainbow Text** - Colorful text effects

### 🔍 **Universal Decoder**
- **Smart Detection**: Automatically detects and decodes any supported format
- **Priority Matching**: Prioritizes decoding based on active transform
- **Fallback Methods**: Tries all available decoders if primary fails
- **Real-time Processing**: Instant decoding as you type

### 📱 **User Experience**
- **Dark/Light Theme**: Toggle between themes
- **Copy History**: Track all copied content with timestamps
- **Auto-copy**: Automatically copy transformed text
- **Keyboard Shortcuts**: Quick access to features
- **Responsive Design**: Works on all device sizes
- **Accessibility**: Screen reader friendly with proper ARIA labels

## 🚀 **Getting Started**

### **Web Version**
1. Open `index.html` in any modern web browser
2. Type text in the input field
3. Choose a transformation from the categorized buttons
4. Click any transform button to apply and auto-copy
5. Use the Universal Decoder to decode any encoded text

### **Python Version**
```bash
pip install streamlit pillow pyperclip
streamlit run parsel_app.py
```

## 🛠️ **Technical Details**

### **Architecture**
- **Frontend**: Vue.js 2.6 with modern CSS
- **Backend**: Streamlit Python app (alternative)
- **Encoding**: UTF-8 with proper Unicode handling
- **Steganography**: Variation selectors and Tags Unicode block

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
- 🆕 **50+ New Languages**: Added fantasy, ancient, and technical scripts
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

This project welcomes contributions! Areas for improvement:

- **New Languages**: Add more fictional or historical scripts
- **Better Decoding**: Improve universal decoder accuracy
- **Performance**: Optimize for very long texts
- **Mobile**: Enhance mobile experience
- **Accessibility**: Improve screen reader support

### 🧩 How to add a new transform

1) Define the transform in `js/transforms.js` inside the `transforms` object:

```js
new_transform_key: {
    name: 'Human Friendly Name',
    // Optional: map for character ↔ character transforms
    map: { /* 'a': 'α', ... */ },
    // Required: encoding function
    func: function(text) { /* return transformed */ },
    // Optional but recommended: short, readable preview
    preview: function(text) { return this.func((text||'').slice(0, 3)) + '...'; },
    // Optional: reverse/decoder (enables universal decoder to use it directly)
    reverse: function(text) { /* return decoded */ }
}
```

2) Add it to a category in `js/app.js` under `transformCategories` so it shows in the UI, e.g.:

```js
transformCategories: {
  cipher: ['Caesar Cipher', 'ROT13', 'Your New Transform']
}
```

3) If your transform uses a custom script or style (not simple ASCII substitutions), ensure the universal decoder can detect it. Add pattern detection or reverse mapping in `universalDecode` in `js/app.js`:

```js
// Example: add to a check list
const customChecks = [{ name: 'Your New Transform', transform: 'your_key' }];
// build reverse map and try decoding if the input contains your characters
```

4) If you want it considered by the Randomizer, add its key to `getRandomizableTransforms()` in `js/transforms.js`.

5) Test it in `test_transforms.html`. Add a button and a simple test harness calling `testTransform('your_key')`.

Tips:
- Keep `preview()` short to avoid UI overflow.
- Prefer providing `reverse()` so the universal decoder can decode it directly.
- Unicode-heavy styles should provide a reverse map for accurate decoding.

## 📄 **License**

This project is open source. See LICENSE file for details.

## 🙏 **Acknowledgments**

- **J.R.R. Tolkien** for Quenya and Tengwar
- **Star Trek** creators for Klingon language
- **Star Wars** creators for Aurebesh
- **Bethesda** for Dovahzul language
- **Unicode Consortium** for character standards

---

**P4RS3LT0NGV3** - Because sometimes you need to speak in tongues that don't exist! 🐉✨
