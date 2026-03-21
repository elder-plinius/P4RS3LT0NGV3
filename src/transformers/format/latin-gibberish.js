// latin gibberish transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Latin Gibberish',
    priority: 50,
    category: 'format',
    func: function(text) {
        // Insert "us" or "um" after consonants before vowels (simplified Latin-sounding)
        const vowels = /[aeiouyAEIOUY]/;
        const consonants = /[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/;
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = i + 1 < text.length ? text[i + 1] : '';
            
            if (consonants.test(char) && vowels.test(nextChar)) {
                // Insert "us" after consonant before vowel
                result += char + 'us';
            } else {
                result += char;
            }
        }
        
        return result;
    },
    reverse: function(text) {
        // Remove "us" after consonants
        return text.replace(/([bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ])us([aeiouyAEIOUY])/gi, '$1$2');
    },
    preview: function(text) {
        if (!text) return '[latin]';
        return this.func(text.slice(0, 10));
    },
    detector: function(text) {
        // Check for "us" pattern after consonants
        return /[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]us[aeiouyAEIOUY]/i.test(text);
    }
});

