// zero-width steganography transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Zero-Width Steganography',
    priority: 100,
    category: 'format',
    // Zero-width characters: ZWSP (U+200B), ZWNJ (U+200C), ZWJ (U+200D), ZWNBSP (U+FEFF)
    zeroWidthChars: ['\u200B', '\u200C', '\u200D', '\uFEFF'],
    func: function(text) {
        // Encode text using zero-width characters
        const bytes = new TextEncoder().encode(text);
        let result = '';
        
        for (const byte of bytes) {
            // Encode each byte as 4 zero-width characters (2 bits per char)
            for (let i = 6; i >= 0; i -= 2) {
                const bits = (byte >> i) & 3; // Get 2 bits
                result += this.zeroWidthChars[bits];
            }
        }
        
        return result;
    },
    reverse: function(text) {
        // Decode zero-width characters back to text
        const bytes = [];
        let bitBuffer = [];
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const index = this.zeroWidthChars.indexOf(char);
            if (index >= 0) {
                bitBuffer.push(index);
                
                // Every 4 characters, convert to a byte
                if (bitBuffer.length === 4) {
                    const byte = (bitBuffer[0] << 6) | (bitBuffer[1] << 4) | (bitBuffer[2] << 2) | bitBuffer[3];
                    bytes.push(byte);
                    bitBuffer = [];
                }
            }
        }
        
        try {
            return new TextDecoder().decode(new Uint8Array(bytes));
        } catch (e) {
            return '';
        }
    },
    preview: function(text) {
        if (!text) return '[zerowidth-stego]';
        return '[zero-width encoded]';
    },
    detector: function(text) {
        // Check for zero-width characters
        return /[\u200B\u200C\u200D\uFEFF]/.test(text);
    }
});

