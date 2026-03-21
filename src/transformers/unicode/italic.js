// italic text transform (Mathematical Italic)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Italic',
    priority: 85,
    category: 'unicode',
    map: {
        'A': '𝐴', 'B': '𝐵', 'C': '𝐶', 'D': '𝐷', 'E': '𝐸', 'F': '𝐹', 'G': '𝐺', 'H': '𝐻',
        'I': '𝐼', 'J': '𝐽', 'K': '𝐾', 'L': '𝐿', 'M': '𝑀', 'N': '𝑁', 'O': '𝑂', 'P': '𝑃',
        'Q': '𝑄', 'R': '𝑅', 'S': '𝑆', 'T': '𝑇', 'U': '𝑈', 'V': '𝑉', 'W': '𝑊', 'X': '𝑋',
        'Y': '𝑌', 'Z': '𝑍',
        'a': '𝑎', 'b': '𝑏', 'c': '𝑐', 'd': '𝑑', 'e': '𝑒', 'f': '𝑓', 'g': '𝑔', 'h': 'ℎ',
        'i': '𝑖', 'j': '𝑗', 'k': '𝑘', 'l': '𝑙', 'm': '𝑚', 'n': '𝑛', 'o': '𝑜', 'p': '𝑝',
        'q': '𝑞', 'r': '𝑟', 's': '𝑠', 't': '𝑡', 'u': '𝑢', 'v': '𝑣', 'w': '𝑤', 'x': '𝑥',
        'y': '𝑦', 'z': '𝑧'
    },
    func: function(text) {
        return [...text].map(c => this.map[c] || c).join('');
    },
    preview: function(text) {
        if (!text) return '[italic]';
        return this.func(text.slice(0, 8));
    },
    detector: function(text) {
        // Check for Mathematical Italic characters (U+1D434-U+1D468)
        return /[\u{1D434}-\u{1D468}]/u.test(text);
    }
});

