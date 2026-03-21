// uppercase all transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Uppercase All',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.toUpperCase();
    },
    reverse: function(text) {
        // Cannot reverse - original case is lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[UPPERCASE]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Check if all letters are uppercase
        const letters = text.replace(/[^a-zA-Z]/g, '');
        return letters.length > 0 && letters === letters.toUpperCase() && /[a-z]/.test(text);
    }
});

