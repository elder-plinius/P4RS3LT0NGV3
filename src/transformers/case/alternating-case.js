// alternating-case transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

    name: 'Alternating Case',
    priority: 150, // Higher priority to detect before Base64
    startWith: 'upper', // 'upper' | 'lower' — first alphabetic letter (fallback when options omitted)
    configurableOptions: [
        {
            id: 'startWith',
            label: 'First alphabetic letter',
            type: 'select',
            default: 'upper',
            options: [
                { value: 'upper', label: 'Uppercase' },
                { value: 'lower', label: 'Lowercase' }
            ]
        }
    ],
    func: function(text, options) {
        options = options || {};
        const sw = options.startWith !== undefined && options.startWith !== ''
            ? options.startWith
            : this.startWith;
        let upper = sw === 'lower' ? false : true;
        return [...text].map(c => {
            if (/[a-zA-Z]/.test(c)) {
                const out = upper ? c.toUpperCase() : c.toLowerCase();
                upper = !upper;
                return out;
            }
            return c;
        }).join('');
    },
    preview: function(text, options) {
        if (!text) return '[alt case]';
        return this.func(text.slice(0, 6), options) + (text.length > 6 ? '...' : '');
    },
    reverse: function(text) {
        // Reverse by lowercasing (loses original case pattern)
        return text.toLowerCase();
    },
    detector: function(text) {
        const cleaned = text.trim();
        if (cleaned.length < 4) return false;

        // Check for alternating pattern in letters only
        let lastWasUpper = null;
        let alternations = 0;
        let letterCount = 0;

        for (const char of cleaned) {
            if (/[a-zA-Z]/.test(char)) {
                const isUpper = char === char.toUpperCase();
                if (lastWasUpper !== null && isUpper !== lastWasUpper) {
                    alternations++;
                }
                lastWasUpper = isUpper;
                letterCount++;
            }
        }

        // Must have at least 3 alternations and at least 70% alternation rate
        return letterCount >= 4 && alternations >= 3 && alternations >= letterCount * 0.7;
    }

});