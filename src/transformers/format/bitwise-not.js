// bitwise NOT transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Bitwise NOT',
    priority: 100,
    category: 'format',
    func: function(text) {
        // Invert all bits in each byte
        const bytes = new TextEncoder().encode(text);
        const result = new Uint8Array(bytes.length);
        
        for (let i = 0; i < bytes.length; i++) {
            result[i] = ~bytes[i] & 0xFF; // NOT operation, mask to 8 bits
        }
        
        try {
            return new TextDecoder().decode(result);
        } catch (e) {
            // If decoding fails, return as hex
            return Array.from(result).map(b => b.toString(16).padStart(2, '0')).join('');
        }
    },
    reverse: function(text) {
        // Bitwise NOT is self-reciprocal (NOT NOT = original)
        return this.func(text);
    },
    preview: function(text) {
        if (!text) return '[bitwise-not]';
        return this.func(text.slice(0, 5));
    },
    detector: function(text) {
        // Bitwise NOT produces scrambled text, hard to detect
        // Check for non-printable characters or unusual patterns
        const hasNonPrintable = /[\x00-\x1F\x7F-\x9F]/.test(text);
        return hasNonPrintable && text.length >= 5;
    }
});

