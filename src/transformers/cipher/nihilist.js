// nihilist cipher transform (Polybius square with numeric key)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Nihilist Cipher',
    priority: 60,
    category: 'cipher',
    key: '12345', // Default numeric key
    // Standard Polybius square (5x5, I and J share same cell)
    square: [
        ['A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I', 'K'],
        ['L', 'M', 'N', 'O', 'P'],
        ['Q', 'R', 'S', 'T', 'U'],
        ['V', 'W', 'X', 'Y', 'Z']
    ],
    func: function(text) {
        const key = (this.key || '12345').replace(/[^0-9]/g, '');
        if (key.length === 0) return text;
        
        const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 0) return text;
        
        // Step 1: Convert text to Polybius coordinates
        const coords = [];
        for (const char of cleaned) {
            let found = false;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (this.square[row][col] === char || (char === 'J' && this.square[row][col] === 'I')) {
                        coords.push((row + 1) * 10 + (col + 1)); // Two-digit number
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }
        
        // Step 2: Add key values to coordinates (repeating key)
        let result = '';
        for (let i = 0; i < coords.length; i++) {
            const keyDigit = parseInt(key[i % key.length]);
            const sum = coords[i] + keyDigit;
            result += sum.toString().padStart(2, '0') + ' ';
        }
        
        return result.trim();
    },
    reverse: function(text) {
        const key = (this.key || '12345').replace(/[^0-9]/g, '');
        if (key.length === 0) return text;
        
        // Extract two-digit numbers
        const numbers = text.match(/\d{2}/g) || [];
        if (numbers.length === 0) return text;
        
        // Step 1: Subtract key values from numbers
        const coords = [];
        for (let i = 0; i < numbers.length; i++) {
            const num = parseInt(numbers[i]);
            const keyDigit = parseInt(key[i % key.length]);
            const coord = num - keyDigit;
            if (coord >= 11 && coord <= 55) {
                coords.push(coord);
            }
        }
        
        // Step 2: Convert coordinates back to letters
        let result = '';
        for (const coord of coords) {
            const row = Math.floor(coord / 10) - 1;
            const col = (coord % 10) - 1;
            
            if (row >= 0 && row < 5 && col >= 0 && col < 5) {
                result += this.square[row][col];
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[nihilist]';
        const result = this.func(text.slice(0, 5));
        return result.substring(0, 15) + '...';
    },
    detector: function(text) {
        // Nihilist produces pairs of digits (typically 11-99 range after key addition)
        const digitPairs = text.match(/\d{2}/g) || [];
        if (digitPairs.length < 3) return false;
        
        // Check if pairs are in reasonable range (after key addition, could be 11-99)
        const validPairs = digitPairs.filter(pair => {
            const num = parseInt(pair);
            return num >= 11 && num <= 99;
        });
        
        // At least 70% should be valid Nihilist pairs
        return validPairs.length / digitPairs.length >= 0.7;
    }
});

