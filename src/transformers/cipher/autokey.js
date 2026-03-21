// autokey cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Autokey Cipher',
    priority: 60,
    category: 'cipher',
    key: 'KEY',
    configurableOptions: [
        {
            id: 'key',
            label: 'Priming key',
            type: 'text',
            default: 'KEY'
        }
    ],
    _key: function(options) {
        const k = options && options.key !== undefined && options.key !== null
            ? String(options.key)
            : null;
        return (k || this.key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
    },
    func: function(text, options) {
        options = options || {};
        const key = this._key(options);
        if (key.length === 0) return text;
        
        let result = '';
        let keyIndex = 0;
        const fullKey = key + text.toUpperCase().replace(/[^A-Z]/g, ''); // Key + plaintext
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const code = c.charCodeAt(0);
            
            if (code >= 65 && code <= 90) { // Uppercase
                const k = fullKey[keyIndex % fullKey.length].charCodeAt(0) - 65;
                result += String.fromCharCode(65 + ((code - 65 + k) % 26));
                keyIndex++;
            } else if (code >= 97 && code <= 122) { // Lowercase
                const k = fullKey[keyIndex % fullKey.length].charCodeAt(0) - 65;
                result += String.fromCharCode(97 + ((code - 97 + k) % 26));
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
        let decodedSoFar = '';
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const code = c.charCodeAt(0);
            
            if (code >= 65 && code <= 90) { // Uppercase
                // Use key for first part, then decoded text
                const keyChar = keyIndex < key.length 
                    ? key[keyIndex] 
                    : decodedSoFar[keyIndex - key.length];
                const k = keyChar.charCodeAt(0) - 65;
                const decoded = String.fromCharCode(65 + ((code - 65 - k + 26) % 26));
                result += decoded;
                decodedSoFar += decoded;
                keyIndex++;
            } else if (code >= 97 && code <= 122) { // Lowercase
                const keyChar = keyIndex < key.length 
                    ? key[keyIndex] 
                    : decodedSoFar[keyIndex - key.length];
                const k = keyChar.charCodeAt(0) - 65;
                const decoded = String.fromCharCode(97 + ((code - 97 - k + 26) % 26));
                result += decoded;
                decodedSoFar += decoded;
                keyIndex++;
            } else {
                result += c;
            }
        }
        
        return result;
    },
    preview: function(text, options) {
        if (!text) return '[autokey]';
        return this.func(text.slice(0, 8), options) + (text.length > 8 ? '...' : '');
    },
    detector: function(text) {
        // Autokey produces ciphertext that looks like scrambled letters
        const cleaned = text.replace(/[^A-Za-z]/g, '');
        if (cleaned.length < 10) return false;
        
        // Should be mostly letters with some pattern
        const letterRatio = cleaned.length / text.length;
        return letterRatio > 0.7;
    }
});

