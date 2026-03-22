// numbers only transform (extract only numbers)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Numbers Only',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[^0-9]/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - non-numbers are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[numbers]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // If text is only digits, might be extracted
        return /^\d+$/.test(text.trim()) && text.length >= 3;
    }
});

