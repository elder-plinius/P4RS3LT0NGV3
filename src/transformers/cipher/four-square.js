// four-square cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Four-Square Cipher',
    priority: 60,
    category: 'cipher',
    key1: 'EXAMPLE', // Top-left square key
    key2: 'KEYWORD', // Bottom-right square key
    // Standard alphabet for top-right and bottom-left squares
    standardAlphabet: 'ABCDEFGHIKLMNOPQRSTUVWXYZ',
    // Create keyed squares
    createKeyedSquare: function(key) {
        const used = new Set();
        const square = [];
        let keyIdx = 0;
        let alphaIdx = 0;
        
        // Fill with key letters first
        for (let i = 0; i < 5; i++) {
            square[i] = [];
            for (let j = 0; j < 5; j++) {
                while (keyIdx < key.length && used.has(key[keyIdx])) {
                    keyIdx++;
                }
                if (keyIdx < key.length) {
                    square[i][j] = key[keyIdx];
                    used.add(key[keyIdx]);
                    keyIdx++;
                } else {
                    // Fill with remaining alphabet
                    while (alphaIdx < this.standardAlphabet.length && used.has(this.standardAlphabet[alphaIdx])) {
                        alphaIdx++;
                    }
                    if (alphaIdx < this.standardAlphabet.length) {
                        square[i][j] = this.standardAlphabet[alphaIdx];
                        used.add(this.standardAlphabet[alphaIdx]);
                        alphaIdx++;
                    }
                }
            }
        }
        return square;
    },
    func: function(text) {
        const key1 = (this.key1 || 'EXAMPLE').toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        const key2 = (this.key2 || 'KEYWORD').toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        
        if (key1.length === 0 || key2.length === 0) return text;
        
        let cleaned = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        if (cleaned.length === 0) return text;
        if (cleaned.length % 2 !== 0) {
            // Pad with X if odd length
            cleaned += 'X';
        }
        
        // Create the four squares
        const topLeft = this.createKeyedSquare(key1);
        const topRight = this.createKeyedSquare(this.standardAlphabet);
        const bottomLeft = this.createKeyedSquare(this.standardAlphabet);
        const bottomRight = this.createKeyedSquare(key2);
        
        let result = '';
        
        // Process pairs of letters
        for (let i = 0; i < cleaned.length; i += 2) {
            const char1 = cleaned[i];
            const char2 = cleaned[i + 1];
            
            // Find char1 in top-left, char2 in bottom-right
            let row1 = -1, col1 = -1;
            let row2 = -1, col2 = -1;
            
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 5; c++) {
                    if (topLeft[r][c] === char1) {
                        row1 = r;
                        col1 = c;
                    }
                    if (bottomRight[r][c] === char2) {
                        row2 = r;
                        col2 = c;
                    }
                }
            }
            
            if (row1 >= 0 && col1 >= 0 && row2 >= 0 && col2 >= 0) {
                // Use row1, col2 from top-right and row2, col1 from bottom-left
                result += topRight[row1][col2] + bottomLeft[row2][col1];
            } else {
                result += char1 + char2;
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const key1 = (this.key1 || 'EXAMPLE').toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        const key2 = (this.key2 || 'KEYWORD').toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        
        if (key1.length === 0 || key2.length === 0) return text;
        
        let cleaned = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        if (cleaned.length === 0) return text;
        if (cleaned.length % 2 !== 0) return text;
        
        // Create the four squares
        const topLeft = this.createKeyedSquare(key1);
        const topRight = this.createKeyedSquare(this.standardAlphabet);
        const bottomLeft = this.createKeyedSquare(this.standardAlphabet);
        const bottomRight = this.createKeyedSquare(key2);
        
        let result = '';
        
        // Process pairs of letters
        for (let i = 0; i < cleaned.length; i += 2) {
            const char1 = cleaned[i];
            const char2 = cleaned[i + 1];
            
            // Find char1 in top-right, char2 in bottom-left
            let row1 = -1, col1 = -1;
            let row2 = -1, col2 = -1;
            
            for (let r = 0; r < 5; r++) {
                for (let c = 0; c < 5; c++) {
                    if (topRight[r][c] === char1) {
                        row1 = r;
                        col1 = c;
                    }
                    if (bottomLeft[r][c] === char2) {
                        row2 = r;
                        col2 = c;
                    }
                }
            }
            
            if (row1 >= 0 && col1 >= 0 && row2 >= 0 && col2 >= 0) {
                // Use row1, col2 from top-left and row2, col1 from bottom-right
                result += topLeft[row1][col2] + bottomRight[row2][col1];
            } else {
                result += char1 + char2;
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[four-square]';
        return this.func(text.slice(0, 4)) + (text.length > 4 ? '...' : '');
    },
    detector: function(text) {
        // Four-Square produces scrambled text (all uppercase letters, no digits)
        const cleaned = text.replace(/[\s]/g, '').toUpperCase();
        if (cleaned.length < 10) return false;
        if (!/^[A-Z]+$/.test(cleaned)) return false;
        if (cleaned.length % 2 !== 0) return false; // Must be even length
        
        // Check if it looks scrambled (not readable English)
        const commonWords = ['THE', 'AND', 'FOR', 'ARE'];
        const hasCommonWords = commonWords.some(word => cleaned.includes(word));
        if (hasCommonWords && cleaned.length < 20) return false;
        
        return true;
    }
});

