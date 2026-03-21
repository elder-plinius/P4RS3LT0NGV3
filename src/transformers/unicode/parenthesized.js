// parenthesized unicode transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Parenthesized',
    priority: 150,
    category: 'unicode',
    map: {
        'A': '⒜', 'B': '⒝', 'C': '⒞', 'D': '⒟', 'E': '⒠',
        'F': '⒡', 'G': '⒢', 'H': '⒣', 'I': '⒤', 'J': '⒥',
        'K': '⒦', 'L': '⒧', 'M': '⒨', 'N': '⒩', 'O': '⒪',
        'P': '⒫', 'Q': '⒬', 'R': '⒭', 'S': '⒮', 'T': '⒯',
        'U': '⒰', 'V': '⒱', 'W': '⒲', 'X': '⒳', 'Y': '⒴',
        'Z': '⒵',
        '1': '⑴', '2': '⑵', '3': '⑶', '4': '⑷', '5': '⑸',
        '6': '⑹', '7': '⑺', '8': '⑻', '9': '⑼', '0': '⑽'
    },
    func: function(text) {
        let result = '';
        for (const char of text) {
            const upper = char.toUpperCase();
            if (this.map[upper]) {
                result += this.map[upper];
            } else if (this.map[char]) {
                result += this.map[char];
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
        if (!text) return '[parenthesized]';
        return this.func(text.slice(0, 5));
    },
    detector: function(text) {
        const parenthesizedChars = Object.values(this.map);
        return parenthesizedChars.some(char => text.includes(char));
    }
});

