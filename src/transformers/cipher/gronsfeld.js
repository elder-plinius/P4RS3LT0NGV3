// gronsfeld cipher transform (Vigenère with numeric key)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Gronsfeld Cipher',
    priority: 60,
    category: 'cipher',
    key: '12345', // Default numeric key
    func: function(text) {
        const key = (this.key || '12345').replace(/[^0-9]/g, '');
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
    reverse: function(text) {
        const key = (this.key || '12345').replace(/[^0-9]/g, '');
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
    preview: function(text) {
        if (!text) return '[gronsfeld]';
        return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
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

