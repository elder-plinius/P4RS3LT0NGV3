// letters extraction transform (extract only letters)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Letters Only',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[^a-zA-Z]/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - non-letters are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[letters]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false
});

