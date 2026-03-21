// letters and numbers only transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Letters & Numbers Only',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[^a-zA-Z0-9]/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - other characters are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[alphanum]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Check if text is only alphanumeric
        return /^[a-zA-Z0-9]+$/.test(text.trim()) && text.length >= 5;
    }
});

