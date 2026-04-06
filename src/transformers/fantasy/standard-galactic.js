// Standard Galactic Alphabet (Commander Keen / Minecraft Enchanting Table)
// Uses web-compatible Unicode characters from various blocks
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Minecraft Enchanting Table',
    priority: 100,
    map: {
        'A': 'ᔑ', 'B': 'ʖ', 'C': 'ᓵ', 'D': '↸', 'E': 'ᒷ', 'F': '⎓', 'G': '⊣',
        'H': '⍑', 'I': '╎', 'J': '⋮', 'K': 'ꖌ', 'L': 'ꖎ', 'M': 'ᒲ', 'N': 'リ',
        'O': '𝙹', 'P': '!¡', 'Q': 'ᑑ', 'R': '∷', 'S': 'ᓭ', 'T': 'ℸ ̣', 'U': '⚍',
        'V': '⍊', 'W': '∴', 'X': '̇/', 'Y': '||', 'Z': '⨅',
    },
    func: function(text) {
        // Convert to uppercase first, then map to Standard Galactic characters
        return [...text].map(c => {
            const upperC = c.toUpperCase();
            return this.map[upperC] || c;
        }).join('');
    },
    reverse: function(text) {
        // Build reverse map for uppercase letters
        const revMap = new Map();
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        
        // Build uppercase reverse map (only for characters that actually change)
        for (let i = 0; i < uppercaseLetters.length; i++) {
            const letter = uppercaseLetters[i];
            const sgaChar = this.map[letter];
            // Only add to map if the character actually changes (not identity mapping)
            if (sgaChar && sgaChar !== letter) {
                revMap.set(sgaChar, letter);
            }
        }
        
        // Handle multi-character mappings first (P, T, X, Y)
        // Must handle these before single chars to avoid partial matches
        let result = text;
        result = result.replace(/!¡/g, 'P');
        result = result.replace(/ℸ ̣/g, 'T');
        result = result.replace(/̇\//g, 'X');
        result = result.replace(/\|\|/g, 'Y');
        
        // Then decode single chars
        // Use spread operator to properly handle surrogate pairs (e.g., '𝙹' U+1D679)
        const chars = [...result];
        let decoded = '';
        for (let i = 0; i < chars.length; i++) {
            const currentChar = chars[i];
            // Try reverse map, then pass through
            if (revMap.has(currentChar)) {
                decoded += revMap.get(currentChar);
            } else {
                decoded += currentChar;
            }
        }
        return decoded;
    },
    detector: function(text) {
        // Check for characteristic SGA characters (single-char only to avoid false positives)
        return /[ᔑʖᓵ↸ᒷ⎓⊣⍑╎⋮ꖌꖎᒲリ𝙹ᑑ∷ᓭ⚍⍊∴⨅]/.test(text);
    }
});
