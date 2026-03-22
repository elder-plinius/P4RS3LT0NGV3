// pigpen cipher transform (also known as Masonic or Freemason's cipher)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Pigpen Cipher',
    priority: 60,
    category: 'cipher',
    // Pigpen cipher uses geometric symbols arranged in grids
    // Standard Pigpen cipher mapping based on dCode.fr implementation (Original variant)
    // Reference: https://www.dcode.fr/pigpen-cipher
    // Grid 1 (A-I): L-shapes and U-shapes in 3x3 grid positions
    // Grid 2 (J-R): Same shapes as A-I but with dots
    // Grid 3 (S-Z): Caret/X shapes (some with dots)
    map: {
        'A': 'ᒧ', 'B': '⊔', 'C': 'ᒪ',
        'D': '⊐', 'E': '☐', 'F': '⊏',
        'G': 'ᒣ', 'H': '⊓', 'I': 'ᒥ',
        'J': '⟓', 'K': '⨃', 'L': 'ᒷ',
        'M': '⪾', 'N': '🝕', 'O': '⪽',
        'P': 'ᒬ', 'Q': '⩀', 'R': '⟔',
        'S': 'ᐯ', 'T': 'ᐳ', 'U': 'ᐸ',
        'V': 'ᐱ', 'W': '⟇', 'X': 'ᑀ',
        'Y': 'ᑅ', 'Z': '⟑'
    },
    func: function(text) {
        return [...text].map(c => {
            const upper = c.toUpperCase();
            if (this.map[upper]) {
                // Preserve case: if original was lowercase, return lowercase symbol
                // (though symbols don't have case, we'll just use the symbol)
                return this.map[upper];
            }
            return c;
        }).join('');
    },
    preview: function(text) {
        if (!text) return '[pigpen]';
        return this.func(text.slice(0, 5));
    },
    detector: function(text) {
        // Check if text contains Pigpen symbols (dCode.fr Unicode characters)
        const pigpenSymbols = /[ᒧ⊔ᒪ⊐☐⊏ᒣ⊓ᒥ⟓⨃ᒷ⪾🝕⪽ᒬ⩀⟔ᐯᐳᐸᐱ⟇ᑀᑅ⟑]/;
        return pigpenSymbols.test(text);
    }
});

