// negative squared unicode transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Negative Squared',
    priority: 150,
    category: 'unicode',
    map: {
        'A': '🅰', 'B': '🅱', 'C': '🅲', 'D': '🅳', 'E': '🅴',
        'F': '🅵', 'G': '🅶', 'H': '🅷', 'I': '🅸', 'J': '🅹',
        'K': '🅺', 'L': '🅻', 'M': '🅼', 'N': '🅽', 'O': '🅾',
        'P': '🅿', 'Q': '🆀', 'R': '🆁', 'S': '🆂', 'T': '🆃',
        'U': '🆄', 'V': '🆅', 'W': '🆆', 'X': '🆇', 'Y': '🆈',
        'Z': '🆉'
    },
    func: function(text) {
        let result = '';
        for (const char of text) {
            const upper = char.toUpperCase();
            if (this.map[upper]) {
                result += this.map[upper];
            } else {
                result += char;
            }
        }
        return result;
    },
    reverse: function(text) {
        const reverseMap = {};
        for (const [key, value] of Object.entries(this.map)) {
            reverseMap[value] = key;
        }
        
        let result = '';
        for (const char of text) {
            if (reverseMap[char]) {
                result += reverseMap[char];
            } else {
                result += char;
            }
        }
        return result;
    },
    preview: function(text) {
        if (!text) return '[negative-squared]';
        return this.func(text.slice(0, 5));
    },
    detector: function(text) {
        const negSquaredChars = Object.values(this.map);
        return negSquaredChars.some(char => text.includes(char));
    }
});

