// affine transform
// Wrapped in IIFE so build/build-transforms.js (which strips `export default`) assigns the
// transformer, not a stray top-level helper (see cipher/rot8000.js).
import BaseTransformer from '../BaseTransformer.js';

export default (() => {
    function modInv(a, m) {
        a = ((a % m) + m) % m;
        for (let x = 1; x < m; x++) {
            if ((a * x) % m === 1) return x;
        }
        return null;
    }

    return new BaseTransformer({

    name: 'Affine Cipher',
    priority: 60,
    a: 5,
    b: 8,
    m: 26,
    invA: 21,
    configurableOptions: [
        {
            id: 'a',
            label: 'Multiplier a (coprime to 26)',
            type: 'number',
            default: 5,
            min: 1,
            max: 25,
            step: 1
        },
        {
            id: 'b',
            label: 'Shift b',
            type: 'number',
            default: 8,
            min: 0,
            max: 25,
            step: 1
        }
    ],
    _params: function(options) {
        options = options || {};
        const m = 26;
        const a = options.a !== undefined && options.a !== '' ? Number(options.a) : this.a;
        const b = options.b !== undefined && options.b !== '' ? Number(options.b) : this.b;
        const inv = modInv(a, m);
        return { a, b, m, invA: inv };
    },
    func: function(text, options) {
        const { a, b, m } = this._params(options);
        return [...text].map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) return String.fromCharCode(65 + ((a * (code - 65) + b) % m));
            if (code >= 97 && code <= 122) return String.fromCharCode(97 + ((a * (code - 97) + b) % m));
            return c;
        }).join('');
    },
    preview: function(text, options) {
        if (!text) return '[affine]';
        return this.func(text.slice(0, 8), options) + (text.length > 8 ? '...' : '');
    },
    reverse: function(text, options) {
        const { b, m, invA } = this._params(options);
        if (invA == null) return text;
        return [...text].map(c => {
            const code = c.charCodeAt(0);
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(65 + ((invA * ((code - 65 - b + m) % m)) % m));
            }
            if (code >= 97 && code <= 122) {
                return String.fromCharCode(97 + ((invA * ((code - 97 - b + m) % m)) % m));
            }
            return c;
        }).join('');
    }

    });
})();
