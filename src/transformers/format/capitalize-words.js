// capitalize words transform (first letter of each word uppercase)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Capitalize Words',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/\b\w/g, c => c.toUpperCase());
    },
    reverse: function(text) {
        // Cannot reverse - original case is lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[Capitalized]';
        return this.func(text.slice(0, 15));
    },
    canDecode: false,
    detector: function(text) {
        // Check if words start with uppercase (Title Case pattern)
        const words = text.split(/\s+/).filter(w => /[a-zA-Z]/.test(w));
        if (words.length < 2) return false;
        return words.every(w => /^[A-Z]/.test(w) || !/[a-zA-Z]/.test(w));
    }
});

