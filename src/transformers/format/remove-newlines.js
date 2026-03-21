// remove newlines transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Newlines',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[\r\n]+/g, ' ');
    },
    reverse: function(text) {
        // Cannot reverse - newline positions are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-newlines]';
        return this.func(text.slice(0, 20));
    },
    canDecode: false,
    detector: function(text) {
        // Check if text should have newlines (has long lines)
        return !/[\r\n]/.test(text) && text.length > 50 && text.split(/\s+/).some(w => w.length > 20);
    }
});

