// ADFGX cipher transform (WWI German cipher)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'ADFGX Cipher',
    priority: 60,
    category: 'cipher',
    key: 'KEYWORD', // Default transposition key
    // ADFGX uses a 5x5 Polybius square with letters A, D, F, G, X as coordinates
    // Standard square (I and J share position)
    square: [
        ['A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I', 'K'],
        ['L', 'M', 'N', 'O', 'P'],
        ['Q', 'R', 'S', 'T', 'U'],
        ['V', 'W', 'X', 'Y', 'Z']
    ],
    // Coordinate labels
    coords: ['A', 'D', 'F', 'G', 'X'],
    func: function(text) {
        const transKey = (this.key || 'KEYWORD').toUpperCase().replace(/[^A-Z]/g, '');
        if (transKey.length === 0) return text;
        
        const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 0) return text;
        
        // Step 1: Convert to ADFGX coordinates (two letters per character)
        let adfgxText = '';
        for (const char of cleaned) {
            let found = false;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (this.square[row][col] === char || (char === 'J' && this.square[row][col] === 'I')) {
                        adfgxText += this.coords[row] + this.coords[col];
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }
        
        // Step 2: Columnar transposition using the key
        const keyLength = transKey.length;
        const numCols = keyLength;
        const numRows = Math.ceil(adfgxText.length / numCols);
        
        // Create grid
        const grid = [];
        let textIdx = 0;
        for (let row = 0; row < numRows; row++) {
            grid[row] = [];
            for (let col = 0; col < numCols; col++) {
                grid[row][col] = textIdx < adfgxText.length ? adfgxText[textIdx++] : '';
            }
        }
        
        // Sort columns by key
        const keyOrder = [];
        for (let i = 0; i < transKey.length; i++) {
            keyOrder.push({ char: transKey[i], index: i });
        }
        keyOrder.sort((a, b) => {
            if (a.char < b.char) return -1;
            if (a.char > b.char) return 1;
            return a.index - b.index;
        });
        
        // Read columns in sorted order
        let result = '';
        for (const keyItem of keyOrder) {
            const col = keyItem.index;
            for (let row = 0; row < numRows; row++) {
                if (grid[row][col]) {
                    result += grid[row][col];
                }
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const transKey = (this.key || 'KEYWORD').toUpperCase().replace(/[^A-Z]/g, '');
        if (transKey.length === 0) return text;
        
        // Only process ADFGX characters
        const cleaned = text.toUpperCase().replace(/[^ADFGX]/g, '');
        if (cleaned.length === 0) return text;
        if (cleaned.length % 2 !== 0) return text; // Must be even length
        
        // Step 1: Reverse columnar transposition
        const keyLength = transKey.length;
        const numCols = keyLength;
        const numRows = Math.ceil(cleaned.length / numCols);
        
        // Determine column order (same as encoding)
        const keyOrder = [];
        for (let i = 0; i < transKey.length; i++) {
            keyOrder.push({ char: transKey[i], index: i });
        }
        keyOrder.sort((a, b) => {
            if (a.char < b.char) return -1;
            if (a.char > b.char) return 1;
            return a.index - b.index;
        });
        
        // Calculate how many characters each original column has
        // When writing row by row, column i gets chars at positions: i, i+numCols, i+2*numCols, ...
        // So column i has: Math.ceil((totalLength - i) / numCols) characters
        
        // Fill grid: write into columns in sorted order
        const grid = [];
        for (let row = 0; row < numRows; row++) {
            grid[row] = new Array(numCols);
        }
        
        let textIdx = 0;
        for (const keyItem of keyOrder) {
            const col = keyItem.index;
            // This column originally had this many characters when written row by row
            const colLength = Math.ceil((cleaned.length - col) / numCols);
            
            // Write characters into this column, filling top to bottom
            for (let row = 0; row < colLength && textIdx < cleaned.length; row++) {
                grid[row][col] = cleaned[textIdx++];
            }
        }
        
        // Read row by row to get ADFGX text
        let adfgxText = '';
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                if (grid[row] && grid[row][col]) {
                    adfgxText += grid[row][col];
                }
            }
        }
        
        // Step 2: Convert ADFGX coordinates back to letters
        let result = '';
        for (let i = 0; i < adfgxText.length; i += 2) {
            if (i + 1 < adfgxText.length) {
                const rowChar = adfgxText[i];
                const colChar = adfgxText[i + 1];
                const row = this.coords.indexOf(rowChar);
                const col = this.coords.indexOf(colChar);
                
                if (row >= 0 && row < 5 && col >= 0 && col < 5) {
                    result += this.square[row][col];
                }
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[adfgx]';
        const result = this.func(text.slice(0, 5));
        return result.substring(0, 12) + (result.length > 12 ? '...' : '');
    },
    detector: function(text) {
        // ADFGX produces only A, D, F, G, X characters
        const cleaned = text.replace(/[\s]/g, '').toUpperCase();
        if (cleaned.length < 10) return false;
        if (!/^[ADFGX]+$/.test(cleaned)) return false;
        // Must be even length (pairs of coordinates)
        return cleaned.length % 2 === 0;
    }
});

