# Transformers

Transformers are instantiated using `BaseTransformer` class. Category is automatically assigned from the directory name.

## Directory Structure

Categories (auto-assigned from directory name):
- `encoding/` - Base64, Hex, Binary, URL, HTML, etc.
- `cipher/` - ROT13, Caesar, Vigenère, Atbash, etc.
- `unicode/` - Cursive, Medieval, Monospace, Bubble, etc.
- `case/` - Snake case, Kebab case, Title case, etc.
- `technical/` - Morse, Braille, NATO, Brainfuck, etc.
- `fantasy/` - Elder Futhark, Tengwar, Klingon, Aurebesh, etc.
- `ancient/` - Hieroglyphics, Ogham, Roman Numerals, etc.
- `format/` - Leetspeak, Pig Latin, Reverse, etc.
- `visual/` - Emoji speak, Rovarspraket, etc.
- `special/` - Randomizer, etc.

## Creating a Transformer

### Required Properties

- `name` - Display name (string)
- `func` - Encoding function `(text) => string`
- `priority` - Decoder priority (number, 1-310)

### Optional Properties

- `reverse` - Decoding function `(text) => string` (auto-generated if `map` provided)
- `map` - Character mapping object (auto-generates `reverse`)
- `detector` - Detection function `(text) => boolean` (for universal decoder)
- `preview` - Preview function `(text) => string` (defaults to `func`)
- `canDecode` - Boolean (default: `true`)
- `description` - Help text (string)

### Example: Character Map (Auto-generates reverse)

```javascript
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Cursive',
    priority: 85,
    map: {
        'a': '𝒶', 'b': '𝒷', 'c': '𝒸',
        // ... more mappings
    },
    func: function(text) {
        return [...text].map(c => this.map[c] || c).join('');
    }
    // reverse is auto-generated from map!
});
```

### Example: Custom Transformer

```javascript
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Base64',
    priority: 270,
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[A-Za-z0-9+\/=]+$/.test(cleaned);
    },
    func: function(text) {
        // Encoding logic
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        let binaryString = '';
        for (let i = 0; i < bytes.length; i++) {
            binaryString += String.fromCharCode(bytes[i]);
        }
        return btoa(binaryString);
    },
    reverse: function(text) {
        // Decoding logic
        const binaryString = atob(text);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    },
    preview: function(text) {
        if (!text) return '[base64]';
        const full = this.func(text);
        return full.substring(0, 12) + (full.length > 12 ? '...' : '');
    }
});
```

### Example: Encoding-Only (No Reverse)

```javascript
export default new BaseTransformer({
    name: 'Random Mix',
    priority: 0,
    canDecode: false,
    func: function(text) {
        // Encoding logic only
        return randomized;
    }
});
```

## Priority Guide

Higher priority = more specific pattern (used for decoder result ordering):

- **310**: Most exclusive (Semaphore Flags)
- **300**: Exclusive character sets (Binary, Morse, Braille, Brainfuck, Tap Code)
- **290**: Hexadecimal
- **285**: Pattern-based (Pig Latin, Dovahzul)
- **280**: Base32
- **270-275**: Base encodings (Base64, Base58, Base45)
- **260**: A1Z26
- **150**: Active transform (user context)
- **100**: High confidence (Fantasy scripts, unique Unicode ranges)
- **85**: Unicode transformations (default)
- **70**: Common encodings (URL, HTML, ASCII85)
- **60**: Ciphers (ROT13, Caesar)
- **50**: Generic text transforms
- **20**: Low confidence generic
- **1**: Invisible text (last resort)
- **0**: Cannot decode / encode-only

## After Adding

1. Place file in appropriate category directory
2. Run `npm run build:transforms`
3. Test in webapp
4. Add `detector` function if format has distinctive patterns
5. Optionally add test cases to `tests/test_universal.js`
6. Add a one-line description for the transform’s `name` in `DESCRIPTIONS` inside `build/readme-transform-section.js`, then run `node build/readme-transform-section.js` and merge the printed block into the **Text Transformations** section of the root `README.md` (the script exits with an error if a transform is missing from `DESCRIPTIONS`)

## Testing

All transformers with `reverse` are automatically tested by `tests/test_universal.js`.

For transformers with known limitations (e.g., lowercases input), add to `limitations` object in `test_universal.js`:

```javascript
const limitations = {
    'your_transform': {
        issues: 'Description of changes',
        normalize: { lowercase: true, stripEmoji: true }
    }
};
```
