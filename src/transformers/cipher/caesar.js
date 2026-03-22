// caesar transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

    name: 'Caesar Cipher',
    priority: 60,
    shift: 3,
    configurableOptions: [
        {
            id: 'shift',
            label: 'Shift (1–25)',
            type: 'number',
            default: 3,
            min: 1,
            max: 25,
            step: 1
        }
    ],
    _encode: function(text, shift) {
        const s = ((shift % 26) + 26) % 26;
        return [...text].map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + s) % 26) + 65);
            }
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + s) % 26) + 97);
            }
            return c;
        }).join('');
    },
    func: function(text, options) {
        options = options || {};
        const shift = options.shift !== undefined && options.shift !== ''
            ? Number(options.shift)
            : this.shift;
        return this._encode(text, shift);
    },
    preview: function(text, options) {
        if (!text) return '[caesar]';
        return this.func(text.slice(0, 3), options) + '...';
    },
    reverse: function(text, options) {
        options = options || {};
        const shift = options.shift !== undefined && options.shift !== ''
            ? Number(options.shift)
            : this.shift;
        const s = ((shift % 26) + 26) % 26;
        return this._encode(text, 26 - s);
    },
    detector: function(text) {
        const cleaned = text.replace(/[\s.,!?;:'"()\-&0-9]/g, '');
        if (cleaned.length < 5) return false;
        const letterCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
        return letterCount / cleaned.length > 0.7;
    }

});
