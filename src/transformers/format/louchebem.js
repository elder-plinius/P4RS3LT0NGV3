// louchebem transform (French slang)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Louchebem',
    priority: 50,
    category: 'format',
    func: function(text) {
        // Move first consonant(s) to end and add "l" + "em" (or "oc", "ic", "uche", etc.)
        const words = text.split(/(\s+|[.,!?;:])/);
        
        return words.map(word => {
            if (!/^[a-zA-Z]+$/.test(word)) return word;
            
            const match = word.match(/^([bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]+)([aeiouyAEIOUY].*)$/);
            if (match) {
                const [, consonants, rest] = match;
                return 'l' + rest + consonants + 'em';
            }
            return word;
        }).join('');
    },
    reverse: function(text) {
        // Reverse louchebem: remove "l" prefix and "em" suffix, move consonants back
        const words = text.split(/(\s+|[.,!?;:])/);
        
        return words.map(word => {
            if (!/^l[a-zA-Z]+em$/i.test(word)) return word;
            
            const body = word.slice(1, -2); // Remove 'l' and 'em'
            const match = body.match(/^([aeiouyAEIOUY].*?)([bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]+)$/);
            if (match) {
                const [, rest, consonants] = match;
                return consonants + rest;
            }
            return word;
        }).join('');
    },
    preview: function(text) {
        if (!text) return '[louchebem]';
        return this.func(text.slice(0, 10));
    },
    detector: function(text) {
        // Check for "l" prefix and "em" suffix pattern
        return /\bl[a-z]+em\b/i.test(text);
    }
});

