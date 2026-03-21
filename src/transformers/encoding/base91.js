// base91 encoding transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Base91',
    priority: 270,
    category: 'encoding',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;<=>?@[]^_`{|}~"',
    func: function(text) {
        const bytes = new TextEncoder().encode(text);
        let num = 0n;
        for (let i = 0; i < bytes.length; i++) {
            num = num * 256n + BigInt(bytes[i]);
        }
        
        if (num === 0n) return this.alphabet[0];
        
        let result = '';
        const base = 91n;
        while (num > 0n) {
            result = this.alphabet[Number(num % base)] + result;
            num = num / base;
        }
        
        return result;
    },
    reverse: function(text) {
        try {
            let num = 0n;
            const base = 91n;
            for (let i = 0; i < text.length; i++) {
                const idx = this.alphabet.indexOf(text[i]);
                if (idx === -1) return text;
                num = num * base + BigInt(idx);
            }
            
            // Convert back to bytes
            const bytes = [];
            while (num > 0n) {
                bytes.unshift(Number(num % 256n));
                num = num / 256n;
            }
            
            return new TextDecoder().decode(new Uint8Array(bytes));
        } catch (e) {
            return text;
        }
    },
    preview: function(text) {
        if (!text) return '[base91]';
        const result = this.func(text.slice(0, 4));
        return result.substring(0, 12) + '...';
    },
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[A-Za-z0-9!#$%&()*+,./:;<=>?@[\]^_`{|}~"]+$/.test(cleaned);
    }
});

