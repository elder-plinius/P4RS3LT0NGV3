// uppercase lowercase toggle transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Toggle Case',
    priority: 50,
    category: 'format',
    func: function(text) {
        return [...text].map(c => {
            if (c >= 'A' && c <= 'Z') {
                return c.toLowerCase();
            } else if (c >= 'a' && c <= 'z') {
                return c.toUpperCase();
            }
            return c;
        }).join('');
    },
    reverse: function(text) {
        // Toggle case is its own inverse
        return this.func(text);
    },
    preview: function(text) {
        if (!text) return '[toggle]';
        return this.func(text.slice(0, 10));
    },
    detector: function(text) {
        // Hard to detect - would need pattern analysis
        return false;
    }
});

