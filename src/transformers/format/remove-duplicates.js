// remove duplicate characters transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Duplicates',
    priority: 50,
    category: 'format',
    func: function(text) {
        const seen = new Set();
        return [...text].filter(c => {
            if (seen.has(c)) {
                return false;
            }
            seen.add(c);
            return true;
        }).join('');
    },
    reverse: function(text) {
        // Cannot reverse - duplicates are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-dupes]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Check if text has no duplicate characters
        const chars = [...text];
        const unique = new Set(chars);
        return chars.length === unique.size && text.length >= 5;
    }
});

