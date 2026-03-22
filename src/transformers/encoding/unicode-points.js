// unicode code points encoding transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Unicode Code Points',
    priority: 250,
    category: 'encoding',
    func: function(text) {
        // Encode text as Unicode code points (U+XXXX format)
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            result += 'U+' + code.toString(16).toUpperCase().padStart(4, '0') + ' ';
        }
        return result.trim();
    },
    reverse: function(text) {
        // Extract U+XXXX patterns and convert back to characters
        const matches = text.match(/U\+([0-9A-Fa-f]{4,6})/g) || [];
        let result = '';
        for (const match of matches) {
            const code = parseInt(match.substring(2), 16);
            if (code >= 0 && code <= 0x10FFFF) {
                result += String.fromCharCode(code);
            }
        }
        return result;
    },
    preview: function(text) {
        if (!text) return '[unicode-points]';
        const result = this.func(text.slice(0, 3));
        return result.substring(0, 20) + '...';
    },
    detector: function(text) {
        // Check for U+XXXX pattern
        const pattern = /U\+[0-9A-Fa-f]{4,6}/;
        return pattern.test(text) && text.match(/U\+[0-9A-Fa-f]{4,6}/g).length >= 2;
    }
});

