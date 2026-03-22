// dashed underline transform (using combining characters)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Dashed Underline',
    priority: 100,
    category: 'unicode',
    func: function(text) {
        // Add dashed underline combining character (U+0320) after each character
        return [...text].map(c => c + '\u0320').join('');
    },
    reverse: function(text) {
        // Remove combining dashed below character
        return text.replace(/\u0320/g, '');
    },
    preview: function(text) {
        if (!text) return '[dashed-underline]';
        return this.func(text.slice(0, 8));
    },
    detector: function(text) {
        // Check for dashed below combining character
        return /\u0320/.test(text);
    }
});

