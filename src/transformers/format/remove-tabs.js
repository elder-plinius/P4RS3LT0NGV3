// remove tabs transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Tabs',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/\t/g, ' ');
    },
    reverse: function(text) {
        // Cannot reverse - tab positions are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-tabs]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Hard to detect
        return false;
    }
});

