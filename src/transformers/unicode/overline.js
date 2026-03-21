// overline transform (using combining characters)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Overline',
    priority: 100,
    category: 'unicode',
    func: function(text) {
        // Add overline combining character (U+0305) after each character
        return [...text].map(c => c + '\u0305').join('');
    },
    reverse: function(text) {
        // Remove combining overline character
        return text.replace(/\u0305/g, '');
    },
    preview: function(text) {
        if (!text) return '[overline]';
        return this.func(text.slice(0, 8));
    },
    detector: function(text) {
        // Check for combining overline character
        return /\u0305/.test(text);
    }
});

