// spaces remover transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Spaces Remover',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/\s+/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - spaces are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-spaces]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false
});

