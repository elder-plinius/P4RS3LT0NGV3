// porta cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Porta Cipher',
    priority: 60,
    category: 'cipher',
    key: 'KEY', // Default key
    func: function(text) {
        const key = (this.key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        if (key.length === 0) return text;
        
        // Porta uses 13 reciprocal alphabets, each pair (A/B, C/D, etc.) shares a tableau
        // Each tableau is reciprocal: if A->B in encode, then B->A in decode (same operation)
        const tableaus = {
            'A': 'NOPQRSTUVWXYZABCDEFGHIJKLM', 'B': 'NOPQRSTUVWXYZABCDEFGHIJKLM',
            'C': 'OPQRSTUVWXYZABCDEFGHIJKLMN', 'D': 'OPQRSTUVWXYZABCDEFGHIJKLMN',
            'E': 'PQRSTUVWXYZABCDEFGHIJKLMNO', 'F': 'PQRSTUVWXYZABCDEFGHIJKLMNO',
            'G': 'QRSTUVWXYZABCDEFGHIJKLMNOP', 'H': 'QRSTUVWXYZABCDEFGHIJKLMNOP',
            'I': 'RSTUVWXYZABCDEFGHIJKLMNOPQ', 'J': 'RSTUVWXYZABCDEFGHIJKLMNOPQ',
            'K': 'STUVWXYZABCDEFGHIJKLMNOPQR', 'L': 'STUVWXYZABCDEFGHIJKLMNOPQR',
            'M': 'TUVWXYZABCDEFGHIJKLMNOPQRS', 'N': 'TUVWXYZABCDEFGHIJKLMNOPQRS',
            'O': 'UVWXYZABCDEFGHIJKLMNOPQRST', 'P': 'UVWXYZABCDEFGHIJKLMNOPQRST',
            'Q': 'VWXYZABCDEFGHIJKLMNOPQRSTU', 'R': 'VWXYZABCDEFGHIJKLMNOPQRSTU',
            'S': 'WXYZABCDEFGHIJKLMNOPQRSTUV', 'T': 'WXYZABCDEFGHIJKLMNOPQRSTUV',
            'U': 'XYZABCDEFGHIJKLMNOPQRSTUVW', 'V': 'XYZABCDEFGHIJKLMNOPQRSTUVW',
            'W': 'YZABCDEFGHIJKLMNOPQRSTUVWX', 'X': 'YZABCDEFGHIJKLMNOPQRSTUVWX',
            'Y': 'ZABCDEFGHIJKLMNOPQRSTUVWXY', 'Z': 'ZABCDEFGHIJKLMNOPQRSTUVWXY'
        };
        
        let result = '';
        let keyIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const code = c.charCodeAt(0);
            
            if (code >= 65 && code <= 90) { // Uppercase
                const keyChar = key[keyIndex % key.length];
                const tableau = tableaus[keyChar];
                const plainPos = code - 65;
                // Porta: cipher = tableau[plain]
                result += tableau[plainPos];
                keyIndex++;
            } else if (code >= 97 && code <= 122) { // Lowercase
                const keyChar = key[keyIndex % key.length];
                const tableau = tableaus[keyChar];
                const plainPos = code - 97;
                // Porta: cipher = tableau[plain] (lowercase)
                result += tableau[plainPos].toLowerCase();
                keyIndex++;
            } else {
                result += c;
            }
        }
        
        return result;
    },
    reverse: function(text) {
        // Porta is self-reciprocal - use reverse lookup in tableau
        const key = (this.key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        if (key.length === 0) return text;
        
        const tableaus = {
            'A': 'NOPQRSTUVWXYZABCDEFGHIJKLM', 'B': 'NOPQRSTUVWXYZABCDEFGHIJKLM',
            'C': 'OPQRSTUVWXYZABCDEFGHIJKLMN', 'D': 'OPQRSTUVWXYZABCDEFGHIJKLMN',
            'E': 'PQRSTUVWXYZABCDEFGHIJKLMNO', 'F': 'PQRSTUVWXYZABCDEFGHIJKLMNO',
            'G': 'QRSTUVWXYZABCDEFGHIJKLMNOP', 'H': 'QRSTUVWXYZABCDEFGHIJKLMNOP',
            'I': 'RSTUVWXYZABCDEFGHIJKLMNOPQ', 'J': 'RSTUVWXYZABCDEFGHIJKLMNOPQ',
            'K': 'STUVWXYZABCDEFGHIJKLMNOPQR', 'L': 'STUVWXYZABCDEFGHIJKLMNOPQR',
            'M': 'TUVWXYZABCDEFGHIJKLMNOPQRS', 'N': 'TUVWXYZABCDEFGHIJKLMNOPQRS',
            'O': 'UVWXYZABCDEFGHIJKLMNOPQRST', 'P': 'UVWXYZABCDEFGHIJKLMNOPQRST',
            'Q': 'VWXYZABCDEFGHIJKLMNOPQRSTU', 'R': 'VWXYZABCDEFGHIJKLMNOPQRSTU',
            'S': 'WXYZABCDEFGHIJKLMNOPQRSTUV', 'T': 'WXYZABCDEFGHIJKLMNOPQRSTUV',
            'U': 'XYZABCDEFGHIJKLMNOPQRSTUVW', 'V': 'XYZABCDEFGHIJKLMNOPQRSTUVW',
            'W': 'YZABCDEFGHIJKLMNOPQRSTUVWX', 'X': 'YZABCDEFGHIJKLMNOPQRSTUVWX',
            'Y': 'ZABCDEFGHIJKLMNOPQRSTUVWXY', 'Z': 'ZABCDEFGHIJKLMNOPQRSTUVWXY'
        };
        
        let result = '';
        let keyIndex = 0;
        
        for (let i = 0; i < text.length; i++) {
            const c = text[i];
            const code = c.charCodeAt(0);
            
            if (code >= 65 && code <= 90) { // Uppercase
                const keyChar = key[keyIndex % key.length];
                const tableau = tableaus[keyChar];
                // Find position of ciphertext char in tableau - that's the plaintext position
                const cipherChar = String.fromCharCode(code);
                const plainPos = tableau.indexOf(cipherChar);
                if (plainPos >= 0) {
                    result += String.fromCharCode(plainPos + 65);
                } else {
                    result += c;
                }
                keyIndex++;
            } else if (code >= 97 && code <= 122) { // Lowercase
                const keyChar = key[keyIndex % key.length];
                const tableau = tableaus[keyChar];
                const cipherChar = String.fromCharCode(code - 32); // Convert to uppercase for lookup
                const plainPos = tableau.indexOf(cipherChar);
                if (plainPos >= 0) {
                    result += String.fromCharCode(plainPos + 97);
                } else {
                    result += c;
                }
                keyIndex++;
            } else {
                result += c;
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[porta]';
        const result = this.func(text.slice(0, 8));
        return result.substring(0, 10) + (result.length > 10 ? '...' : '');
    },
    detector: function(text) {
        const cleaned = text.replace(/[\s.,!?;:'"()\-&0-9]/g, '');
        if (cleaned.length < 5) return false;
        const letterCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
        return letterCount / cleaned.length > 0.7;
    }
});

