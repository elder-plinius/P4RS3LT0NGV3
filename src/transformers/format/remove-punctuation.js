// remove punctuation transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Punctuation',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[.,!?;:'"()\-_\[\]{}@#$%^&*+=|\\\/<>~`]/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - punctuation is lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-punct]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Hard to detect - would need to check if text should have punctuation
        return false;
    }
});

