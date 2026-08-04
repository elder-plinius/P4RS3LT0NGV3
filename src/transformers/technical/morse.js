// morse transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Morse Code',
    priority: 300,
    // Detector: Only dots, dashes, slashes, and spaces
    detector: function(text) {
        const cleaned = text.trim();
        return cleaned.length >= 5 && /^[\.\-\/\s]+$/.test(cleaned);
    },
    
    map: {
            // Letters
            'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.',
            'g': '--.', 'h': '....', 'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..',
            'm': '--', 'n': '-.', 'o': '---', 'p': '.--.', 'q': '--.-', 'r': '.-.',
            's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
            'y': '-.--', 'z': '--..',
            // Numbers
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            // Punctuation
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--',
            '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
            ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
            '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
        },
        // Create reverse map for decoding
        reverseMap: function() {
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            return revMap;
        },
        // Second arg is the shared options object every other transform takes.
        // It used to be a bare `decode` boolean, which silently broke encoding:
        // the app always passes an options object, and `{}` is truthy, so every
        // encode request ran as a decode and returned "". Accept both — `true`
        // for the internal reverse() call, or `{ decode: true }` from options.
        func: function(text, options) {
            const decode = options === true || !!(options && options.decode === true);
            if (decode) {
                // Decode mode
                const revMap = this.reverseMap();
                // Split by word separator (/ or multiple spaces) and then by character separator (single space)
                return text.split(/\s*\/\s*|\s{3,}/).map(word => 
                    word.split(/\s+/).map(code => revMap[code] || '').join('')
                ).join(' ');
            } else {
                // Encode mode - handle word boundaries with /
                return text.split(/\s+/).map(word => 
                    [...word.toLowerCase()].map(c => this.map[c] || '').filter(x => x).join(' ')
                ).join(' / ');
            }
        },
        preview: function(text) {
            if (!text) return '[morse]';
            const result = this.func(text.slice(0, 2));
            return result + '...';
        },
        reverse: function(text) {
            return this.func(text, true);
        }

});