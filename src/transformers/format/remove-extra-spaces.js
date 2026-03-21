// remove extra spaces transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Extra Spaces',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[ \t]+/g, ' ').trim();
    },
    reverse: function(text) {
        // Cannot reverse - original spacing is lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-extra-spaces]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Check if text has multiple consecutive spaces
        return /  +/.test(text);
    }
});

