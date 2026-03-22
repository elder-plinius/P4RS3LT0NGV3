// javanais transform (French slang insertion)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Javanais',
    priority: 50,
    category: 'format',
    func: function(text) {
        // Insert "av" before each vowel (a, e, i, o, u, y) that follows a consonant
        const vowels = /[aeiouyAEIOUY]/;
        const consonants = /[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/;
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const prevChar = i > 0 ? text[i - 1] : '';
            
            if (vowels.test(char) && (i === 0 || consonants.test(prevChar))) {
                result += 'av' + char;
            } else {
                result += char;
            }
        }
        
        return result;
    },
    reverse: function(text) {
        // Remove "av" before vowels that follow consonants
        return text.replace(/av([aeiouyAEIOUY])/g, '$1');
    },
    preview: function(text) {
        if (!text) return '[javanais]';
        return this.func(text.slice(0, 10));
    },
    detector: function(text) {
        // Check for "av" pattern before vowels
        return /av[aeiouyAEIOUY]/i.test(text);
    }
});

