// shuffle characters transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Shuffle Characters',
    priority: 50,
    category: 'format',
    func: function(text) {
        // Fisher-Yates shuffle
        const chars = [...text];
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join('');
    },
    reverse: function(text) {
        // Cannot reverse - order is randomized
        return text;
    },
    preview: function(text) {
        if (!text) return '[shuffled]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Cannot detect - random order
        return false;
    }
});

