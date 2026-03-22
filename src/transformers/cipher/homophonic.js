// homophonic cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Homophonic Cipher',
    priority: 60,
    category: 'cipher',
    // Simple homophonic substitution - each letter maps to multiple symbols
    map: {
        'A': ['1', '2', '3'], 'B': ['4', '5'], 'C': ['6', '7', '8'],
        'D': ['9', '10'], 'E': ['11', '12', '13', '14', '15'], 'F': ['16', '17'],
        'G': ['18', '19'], 'H': ['20', '21', '22'], 'I': ['23', '24', '25', '26'],
        'J': ['27'], 'K': ['28'], 'L': ['29', '30', '31'], 'M': ['32', '33'],
        'N': ['34', '35', '36'], 'O': ['37', '38', '39', '40'], 'P': ['41', '42'],
        'Q': ['43'], 'R': ['44', '45', '46'], 'S': ['47', '48', '49', '50'],
        'T': ['51', '52', '53', '54', '55'], 'U': ['56', '57'], 'V': ['58'],
        'W': ['59', '60'], 'X': ['61'], 'Y': ['62', '63'], 'Z': ['64']
    },
    func: function(text) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const c = text[i].toUpperCase();
            if (this.map[c]) {
                // Randomly select one of the homophones
                const options = this.map[c];
                result += options[Math.floor(Math.random() * options.length)];
                // Add space after number (but not if next char is already a space)
                if (i < text.length - 1 && text[i + 1] !== ' ') {
                    result += ' ';
                }
            } else if (c === ' ') {
                // Preserve spaces - add as double space to distinguish from number separators
                result += '  ';
            } else {
                // Non-letter characters (keep as-is, no space after)
                result += text[i];
            }
        }
        return result;
    },
    reverse: function(text) {
        // Build reverse map
        if (!this._reverseMap) {
            this._reverseMap = {};
            for (const [letter, numbers] of Object.entries(this.map)) {
                numbers.forEach(num => {
                    this._reverseMap[num] = letter;
                });
            }
        }
        
        // Numbers are separated by single spaces, double spaces are original spaces
        let result = '';
        // Split on double spaces first to preserve original spaces
        const sections = text.split(/\s{2,}/);
        
        for (let s = 0; s < sections.length; s++) {
            const section = sections[s];
            // Split on spaces, but also handle punctuation
            const tokens = section.split(/(\s+)/);
            
            for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                if (/^\s+$/.test(token)) {
                    // Whitespace - skip (single spaces between numbers)
                    continue;
                } else if (/^\d+$/.test(token)) {
                    // Pure number - decode it
                    result += this._reverseMap[token] || token;
                } else {
                    // Contains non-digits - extract numbers and decode, preserve rest
                    // Match numbers that are space-separated
                    const parts = token.split(/(\d+)/);
                    for (let j = 0; j < parts.length; j++) {
                        const part = parts[j];
                        if (/^\d+$/.test(part)) {
                            result += this._reverseMap[part] || part;
                        } else {
                            result += part;
                        }
                    }
                }
            }
            
            // Add space between sections (original spaces)
            if (s < sections.length - 1) {
                result += ' ';
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[homophonic]';
        const result = this.func(text.slice(0, 3));
        return result.substring(0, 15) + '...';
    },
    detector: function(text) {
        // Check if text is space-separated numbers (homophonic cipher output)
        const parts = text.trim().split(/\s+/);
        return parts.length >= 3 && parts.every(p => /^\d+$/.test(p));
    }
});

