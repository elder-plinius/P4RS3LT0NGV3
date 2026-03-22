// wavy underline transform (using combining characters)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Wavy Underline',
    priority: 100,
    category: 'unicode',
    func: function(text) {
        // Add wavy underline combining character (U+0330) after each character
        return [...text].map(c => c + '\u0330').join('');
    },
    reverse: function(text) {
        // Remove combining wavy below character
        return text.replace(/\u0330/g, '');
    },
    preview: function(text) {
        if (!text) return '[wavy-underline]';
        return this.func(text.slice(0, 8));
    },
    detector: function(text) {
        // Check for wavy below combining character
        return /\u0330/.test(text);
    }
});

