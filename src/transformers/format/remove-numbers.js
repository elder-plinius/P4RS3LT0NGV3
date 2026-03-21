// remove numbers transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Numbers',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[0-9]/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - numbers are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-numbers]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Hard to detect - would need context
        return false;
    }
});

