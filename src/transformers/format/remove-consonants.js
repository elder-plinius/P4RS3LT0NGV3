// remove consonants transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Consonants',
    priority: 50,
    category: 'format',
    func: function(text) {
        return text.replace(/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/g, '');
    },
    reverse: function(text) {
        // Cannot reverse - consonants are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[vowels-only]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // If text has only vowels/spaces/punctuation, might have consonants removed
        const cleaned = text.replace(/[\s.,!?;:'"()\-&0-9]/g, '');
        return cleaned.length > 0 && !/[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/i.test(cleaned);
    }
});

