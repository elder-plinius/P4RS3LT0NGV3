// binary coded decimal (BCD) transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Binary Coded Decimal',
    priority: 300,
    category: 'encoding',
    func: function(text) {
        return [...text].map(c => {
            const code = c.charCodeAt(0);
            // Convert each digit of the char code to BCD
            return code.toString().split('').map(d => {
                const digit = parseInt(d);
                return digit.toString(2).padStart(4, '0');
            }).join(' ');
        }).join(' ');
    },
    reverse: function(text) {
        try {
            const bcdGroups = text.trim().split(/\s+/);
            const chars = [];
            let currentCode = '';
            
            for (let i = 0; i < bcdGroups.length; i++) {
                if (bcdGroups[i].length === 4 && /^[01]+$/.test(bcdGroups[i])) {
                    currentCode += parseInt(bcdGroups[i], 2).toString();
                    if (currentCode.length >= 3) {
                        const code = parseInt(currentCode);
                        if (code >= 0 && code <= 65535) {
                            chars.push(String.fromCharCode(code));
                            currentCode = '';
                        }
                    }
                }
            }
            
            return chars.join('');
        } catch (e) {
            return text;
        }
    },
    preview: function(text) {
        if (!text) return '[bcd]';
        return this.func(text.slice(0, 2));
    },
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[01]+$/.test(cleaned) && cleaned.length % 4 === 0;
    }
});

