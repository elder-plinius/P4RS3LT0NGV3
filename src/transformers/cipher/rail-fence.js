// rail-fence transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

    name: 'Rail Fence',
    priority: 60,
    rails: 3,
    configurableOptions: [
        {
            id: 'rails',
            label: 'Number of rails',
            type: 'number',
            default: 3,
            min: 2,
            max: 20,
            step: 1
        }
    ],
    _rails: function(options) {
        options = options || {};
        const r = options.rails !== undefined && options.rails !== ''
            ? Number(options.rails)
            : this.rails;
        return Math.max(2, Math.min(50, Math.floor(r) || 2));
    },
    func: function(text, options) {
        const n = this._rails(options);
        const rails = Array.from({ length: n }, () => []);
        let rail = 0;
        let dir = 1;
        for (const ch of text) {
            rails[rail].push(ch);
            rail += dir;
            if (rail === 0 || rail === n - 1) dir *= -1;
        }
        return rails.flat().join('');
    },
    preview: function(text, options) {
        if (!text) return '[rail]';
        return this.func(text.slice(0, 12), options) + (text.length > 12 ? '...' : '');
    },
    reverse: function(text, options) {
        const n = this._rails(options);
        const chars = Array.from(text);
        const len = chars.length;
        const pattern = [];
        let rail = 0;
        let dir = 1;
        for (let i = 0; i < len; i++) {
            pattern.push(rail);
            rail += dir;
            if (rail === 0 || rail === n - 1) dir *= -1;
        }
        const counts = Array(n).fill(0);
        for (const r of pattern) counts[r]++;
        const railsArr = [];
        let idx = 0;
        for (let r = 0; r < n; r++) {
            railsArr[r] = chars.slice(idx, idx + counts[r]);
            idx += counts[r];
        }
        const positions = Array(n).fill(0);
        let out = '';
        for (const r of pattern) {
            out += railsArr[r][positions[r]++];
        }
        return out;
    }

});
