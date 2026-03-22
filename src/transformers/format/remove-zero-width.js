// remove zero width characters transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Zero Width',
    priority: 50,
    category: 'format',
    func: function(text) {
        // Remove zero-width spaces, joiners, non-joiners, and other invisible characters
        return text.replace(/[\u200B-\u200D\uFEFF\u2060]/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - zero-width characters are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-zw]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Check if text contains zero-width characters
        return /[\u200B-\u200D\uFEFF\u2060]/.test(text);
    }
});

