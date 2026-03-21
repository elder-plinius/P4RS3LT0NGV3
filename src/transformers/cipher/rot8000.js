// ROT8000 cipher transform (Unicode rotation)
import BaseTransformer from '../BaseTransformer.js';

// Build valid character codes once (excludes control chars and surrogates)
function buildValidCodes() {
    const validCodes = [];
    for (let i = 0; i <= 0xFFFF; i++) {
        // Skip control characters (0x0000-0x001F)
        if (i >= 0x0000 && i <= 0x001F) continue;
        // Skip DEL and some controls (0x007F-0x00A0)
        if (i >= 0x007F && i <= 0x00A0) continue;
        // Skip surrogate pairs (0xD800-0xDFFF)
        if (i >= 0xD800 && i <= 0xDFFF) continue;
        validCodes.push(i);
    }
    return validCodes;
}

// Cache the valid codes and mappings
let cachedValidCodes = null;
let cachedCodeToIndex = null;
let cachedShift = null;

function getRot8000Data() {
    if (!cachedValidCodes) {
        cachedValidCodes = buildValidCodes();
        // ROT8000 uses a shift that makes it self-reciprocal (applying twice returns original)
        // The shift should be approximately 0x8000 (32768), which is half the BMP
        // For self-reciprocity: (index + shift + shift) % validCount == index
        // This means: (2 * shift) % validCount == 0, so shift = validCount / 2
        cachedShift = Math.floor(cachedValidCodes.length / 2);
        cachedCodeToIndex = new Map();
        cachedValidCodes.forEach((code, index) => {
            cachedCodeToIndex.set(code, index);
        });
    }
    return { validCodes: cachedValidCodes, codeToIndex: cachedCodeToIndex, shift: cachedShift };
}

export default new BaseTransformer({
    name: 'ROT8000',
    priority: 50,
    category: 'cipher',
    func: function(text) {
        // ROT8000 rotates Unicode BMP characters (0x0000-0xFFFF)
        // Excludes control characters: U+0000-U+001F, U+007F-U+00A0, U+D800-U+DFFF
        // Shift is half the valid range for self-reciprocity
        
        const { validCodes, codeToIndex, shift } = getRot8000Data();
        const validCount = validCodes.length;
        
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            
            // Check if character is in valid range
            if (codeToIndex.has(code)) {
                const index = codeToIndex.get(code);
                const rotatedIndex = (index + shift) % validCount;
                const rotatedCode = validCodes[rotatedIndex];
                result += String.fromCharCode(rotatedCode);
            } else {
                // Keep invalid characters as-is (spaces, emojis, etc.)
                result += text[i];
            }
        }
        
        return result;
    },
    reverse: function(text) {
        // ROT8000 is self-reciprocal (rotating by 0x8000 twice = full rotation)
        return this.func(text);
    },
    preview: function(text) {
        if (!text) return '[rot8000]';
        return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
    },
    detector: function(text) {
        // ROT8000 produces characters in various Unicode ranges
        // Check for non-ASCII characters that aren't typical text
        const hasNonAscii = /[^\x00-\x7F]/.test(text);
        const hasControlChars = /[\x00-\x1F]/.test(text);
        return hasNonAscii && text.length >= 5;
    }
});

