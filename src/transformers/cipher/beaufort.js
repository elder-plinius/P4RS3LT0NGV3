// beaufort cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Beaufort Cipher',
    priority: 60,
    category: 'cipher',
    key: 'KEY', // Default key
    func: function(text) {
        const key = (this.key || 'KEY').toUpperCase();
        const keyLength = key.length;
        let keyIndex = 0;
        
        return [...text].map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) { // Uppercase
                const keyChar = key[keyIndex % keyLength].charCodeAt(0) - 65;
                const plainChar = code - 65;
                // Beaufort: cipher = (key - plain) mod 26
                const result = String.fromCharCode(((keyChar - plainChar + 26) % 26) + 65);
                keyIndex++;
                return result;
            } else if (code >= 97 && code <= 122) { // Lowercase
                const keyChar = key[keyIndex % keyLength].charCodeAt(0) - 65;
                const plainChar = code - 97;
                // Beaufort: cipher = (key - plain) mod 26
                const result = String.fromCharCode(((keyChar - plainChar + 26) % 26) + 97);
                keyIndex++;
                return result;
            } else {
                return c;
            }
        }).join('');
    },
    reverse: function(text) {
        // Beaufort cipher is self-reciprocal (same function for encode/decode)
        return this.func(text);
    },
    preview: function(text) {
        if (!text) return '[beaufort]';
        const result = this.func(text.slice(0, 8));
        return result.substring(0, 10) + (result.length > 10 ? '...' : '');
    },
    detector: function(text) {
        const cleaned = text.replace(/[\s.,!?;:'"()\-&0-9]/g, '');
        if (cleaned.length < 5) return false;
        const letterCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
        return letterCount / cleaned.length > 0.7;
    }
});

