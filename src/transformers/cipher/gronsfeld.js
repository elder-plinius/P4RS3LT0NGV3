// gronsfeld cipher transform (Vigenère with numeric key)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Gronsfeld Cipher',
    priority: 60,
    category: 'cipher',
    key: '12345',
    configurableOptions: [
        {
            id: 'key',
            label: 'Numeric key (digits)',
            type: 'text',
            default: '12345'
        }
    ],
    _key: function(options) {
        const k = options && options.key !== undefined && options.key !== null
            ? String(options.key)
            : null;
        return (k || this.key || '12345').replace(/[^0-9]/g, '');
    },
    func: function(text, options) {
        options = options || {};
        const key = this._key(options);
        if (key.length === 0) return text;
        
        let result = '';
        let keyIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const code = c.charCodeAt(0);
            const shift = parseInt(key[keyIndex % key.length]);
            
            if (code >= 65 && code <= 90) { // Uppercase
                result += String.fromCharCode(65 + ((code - 65 + shift) % 26));
                keyIndex++;
            } else if (code >= 97 && code <= 122) { // Lowercase
                result += String.fromCharCode(97 + ((code - 97 + shift) % 26));
                keyIndex++;
            } else {
                result += c;
            }
        }
        
        return result;
    },
    reverse: function(text, options) {
        options = options || {};
        const key = this._key(options);
        if (key.length === 0) return text;
        
        let result = '';
        let keyIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const code = c.charCodeAt(0);
            const shift = parseInt(key[keyIndex % key.length]);
            
            if (code >= 65 && code <= 90) { // Uppercase
                result += String.fromCharCode(65 + ((code - 65 - shift + 26) % 26));
                keyIndex++;
            } else if (code >= 97 && code <= 122) { // Lowercase
                result += String.fromCharCode(97 + ((code - 97 - shift + 26) % 26));
                keyIndex++;
            } else {
                result += c;
            }
        }
        
        return result;
    },
    preview: function(text, options) {
        if (!text) return '[gronsfeld]';
        return this.func(text.slice(0, 8), options) + (text.length > 8 ? '...' : '');
    },
    detector: function(text) {
        // Gronsfeld produces ciphertext that looks like scrambled letters
        const cleaned = text.replace(/[^A-Za-z]/g, '');
        if (cleaned.length < 10) return false;
        
        // Should be mostly letters with some pattern
        const letterRatio = cleaned.length / text.length;
        return letterRatio > 0.7;
    }
});

