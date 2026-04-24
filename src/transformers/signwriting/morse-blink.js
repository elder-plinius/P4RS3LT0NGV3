// Morse Blink SignWriting transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Morse Blink',
    priority: 0,
    canDecode: false,
    description: 'Encodes text as Morse code using SignWriting eye blink symbols (dot = brief close, dash = tight press).',

    DOT: '𝧿𝨕',   // Eye closes briefly
    DASH: '𝧿𝨖',  // Eye pressed tightly
    GAP: '𝧿𝨚',   // Eye open (delimiter)

    morseMap: {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
        'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
        'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
        'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
        'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--',
        '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.', '0': '-----', ' ': '/'
    },

    func: function(text) {
        var upper = text.toUpperCase();
        var lines = [];
        for (var i = 0; i < upper.length; i++) {
            var ch = upper[i];
            var code = this.morseMap[ch];
            if (!code) continue;
            if (code === '/') {
                lines.push('');
                continue;
            }
            var symbols = [];
            for (var j = 0; j < code.length; j++) {
                symbols.push(code[j] === '.' ? this.DOT : this.DASH);
            }
            lines.push(symbols.join(' ') + ' ' + this.GAP);
        }
        return lines.join('\n');
    },

    preview: function(text) {
        if (!text) return '[Morse Blink]';
        return this.func(text.slice(0, 3));
    }
});
