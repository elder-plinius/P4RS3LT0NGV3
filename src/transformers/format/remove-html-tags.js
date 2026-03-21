// remove html tags transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove HTML Tags',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/<[^>]*>/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - HTML tags are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-html]';
        return this.func(text.slice(0, 15));
    },
    canDecode: false,
    detector: function(text) {
        // Check if text contains HTML tags
        return /<[^>]+>/.test(text);
    }
});

