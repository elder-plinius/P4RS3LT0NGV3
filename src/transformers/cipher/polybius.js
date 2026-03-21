// polybius square cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Polybius Square',
    priority: 60,
    category: 'cipher',
    // Standard Polybius square (5x5, I and J share same cell)
    square: [
        ['A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I', 'K'], // I and J share position
        ['L', 'M', 'N', 'O', 'P'],
        ['Q', 'R', 'S', 'T', 'U'],
        ['V', 'W', 'X', 'Y', 'Z']
    ],
    func: function(text) {
        const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 0) return text;
        
        let result = '';
        for (const char of cleaned) {
            let found = false;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (this.square[row][col] === char || (char === 'J' && this.square[row][col] === 'I')) {
                        result += String(row + 1) + String(col + 1);
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
            if (!found) {
                result += char;
            }
        }
        
        return result;
    },
    reverse: function(text) {
        // Extract number pairs sequentially
        let result = '';
        let i = 0;
        
        while (i < text.length) {
            // Look for two consecutive digits
            if (i + 1 < text.length && /\d/.test(text[i]) && /\d/.test(text[i + 1])) {
                const row = parseInt(text[i]) - 1;
                const col = parseInt(text[i + 1]) - 1;
                
                if (row >= 0 && row < 5 && col >= 0 && col < 5) {
                    result += this.square[row][col];
                    i += 2;
                } else {
                    result += text[i];
                    i++;
                }
            } else {
                result += text[i];
                i++;
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[polybius]';
        const result = this.func(text.slice(0, 5));
        return result.substring(0, 10) + (result.length > 10 ? '...' : '');
    },
    detector: function(text) {
        // Polybius square produces pairs of digits (11-55)
        const digitPairs = text.match(/\d{2}/g) || [];
        if (digitPairs.length < 3) return false;
        
        // Check if pairs are valid (1-5 for each digit)
        const validPairs = digitPairs.filter(pair => {
            const d1 = parseInt(pair[0]);
            const d2 = parseInt(pair[1]);
            return d1 >= 1 && d1 <= 5 && d2 >= 1 && d2 <= 5;
        });
        
        // At least 70% should be valid Polybius pairs
        return validPairs.length / digitPairs.length >= 0.7;
    }
});

