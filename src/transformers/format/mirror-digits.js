// mirror digits transform (mirror only numbers)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Mirror Digits',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/\d+/g, match => {
            return match.split('').reverse().join('');
        });
    },
    reverse: function(text) {
        // Mirror digits is its own inverse
        return this.func(text);
    },
    preview: function(text) {
        if (!text) return '[mirror-digits]';
        return this.func(text.slice(0, 10));
    },
    detector: function(text) {
        // Check if text has numbers that might be mirrored
        return /\d/.test(text);
    }
});

