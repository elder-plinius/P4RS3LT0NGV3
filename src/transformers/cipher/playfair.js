// playfair cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Playfair Cipher',
    priority: 60,
    category: 'cipher',
    key: 'KEYWORD', // Default key
    func: function(text) {
        const key = (this.key || 'KEYWORD').toUpperCase().replace(/[^A-Z]/g, '');
        if (key.length === 0) return text;
        
        // Create Playfair square
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // J is combined with I
        const keyChars = [...new Set(key.split(''))];
        const remaining = alphabet.split('').filter(c => !keyChars.includes(c));
        const square = [...keyChars, ...remaining];
        
        // Helper to find position in square
        const findPos = (char) => {
            const idx = square.indexOf(char === 'J' ? 'I' : char);
            return { row: Math.floor(idx / 5), col: idx % 5 };
        };
        
        // Helper to get char from position
        const getChar = (row, col) => square[row * 5 + col];
        
        // Prepare text: remove non-letters, replace J with I, add X between double letters
        let prepared = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
        if (prepared.length % 2 !== 0) prepared += 'X';
        
        // Process pairs
        let result = '';
        for (let i = 0; i < prepared.length; i += 2) {
            const a = prepared[i];
            const b = prepared[i + 1];
            const posA = findPos(a);
            const posB = findPos(b);
            
            if (posA.row === posB.row) {
                // Same row: shift right
                result += getChar(posA.row, (posA.col + 1) % 5);
                result += getChar(posB.row, (posB.col + 1) % 5);
            } else if (posA.col === posB.col) {
                // Same column: shift down
                result += getChar((posA.row + 1) % 5, posA.col);
                result += getChar((posB.row + 1) % 5, posB.col);
            } else {
                // Rectangle: swap columns
                result += getChar(posA.row, posB.col);
                result += getChar(posB.row, posA.col);
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const key = (this.key || 'KEYWORD').toUpperCase().replace(/[^A-Z]/g, '');
        if (key.length === 0) return text;
        
        const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
        const keyChars = [...new Set(key.split(''))];
        const remaining = alphabet.split('').filter(c => !keyChars.includes(c));
        const square = [...keyChars, ...remaining];
        
        const findPos = (char) => {
            const idx = square.indexOf(char === 'J' ? 'I' : char);
            return { row: Math.floor(idx / 5), col: idx % 5 };
        };
        
        const getChar = (row, col) => square[row * 5 + col];
        
        let prepared = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (prepared.length % 2 !== 0) prepared += 'X';
        
        let result = '';
        for (let i = 0; i < prepared.length; i += 2) {
            const a = prepared[i];
            const b = prepared[i + 1];
            const posA = findPos(a);
            const posB = findPos(b);
            
            if (posA.row === posB.row) {
                // Same row: shift left
                result += getChar(posA.row, (posA.col + 4) % 5);
                result += getChar(posB.row, (posB.col + 4) % 5);
            } else if (posA.col === posB.col) {
                // Same column: shift up
                result += getChar((posA.row + 4) % 5, posA.col);
                result += getChar((posB.row + 4) % 5, posB.col);
            } else {
                // Rectangle: swap columns (same as encode)
                result += getChar(posA.row, posB.col);
                result += getChar(posB.row, posA.col);
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[playfair]';
        const result = this.func(text.slice(0, 8));
        return result.substring(0, 10) + (result.length > 10 ? '...' : '');
    },
    detector: function(text) {
        const cleaned = text.replace(/[\s]/g, '').toUpperCase();
        return cleaned.length >= 4 && cleaned.length % 2 === 0 && /^[A-Z]+$/.test(cleaned);
    }
});

