// ROT128 cipher transform (Extended ASCII rotation)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'ROT128',
    priority: 50,
    category: 'cipher',
    func: function(text) {
        // ROT128 rotates through Extended ASCII range 0-255
        const shift = 128;
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i);
            // Rotate within 0-255 range
            if (code >= 0 && code <= 255) {
                const rotated = (code + shift) % 256;
                result += String.fromCharCode(rotated);
            } else {
                result += text[i]; // Keep characters outside range as-is
            }
        }
        
        return result;
    },
    reverse: function(text) {
        // ROT128 is self-reciprocal (rotating by 128 twice = full rotation)
        return this.func(text);
    },
    preview: function(text) {
        if (!text) return '[rot128]';
        return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
    },
    detector: function(text) {
        // ROT128 produces extended ASCII characters (128-255)
        const hasExtendedAscii = /[\x80-\xFF]/.test(text);
        return hasExtendedAscii && text.length >= 5;
    }
});

