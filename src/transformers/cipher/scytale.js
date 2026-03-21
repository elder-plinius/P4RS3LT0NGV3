// scytale cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Scytale Cipher',
    priority: 60,
    category: 'cipher',
    key: 5, // Default number of columns (wrapping width)
    func: function(text) {
        const key = parseInt(this.key) || 5;
        if (key < 2) return text;
        
        // Remove spaces for encoding
        const cleaned = text.replace(/\s/g, '').toUpperCase();
        if (cleaned.length === 0) return text;
        
        // Calculate number of rows needed
        const numRows = Math.ceil(cleaned.length / key);
        
        // Fill grid row by row
        const grid = [];
        for (let i = 0; i < numRows; i++) {
            grid[i] = [];
            for (let j = 0; j < key; j++) {
                const idx = i * key + j;
                grid[i][j] = idx < cleaned.length ? cleaned[idx] : '';
            }
        }
        
        // Read column by column
        let result = '';
        for (let j = 0; j < key; j++) {
            for (let i = 0; i < numRows; i++) {
                if (grid[i][j]) {
                    result += grid[i][j];
                }
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const key = parseInt(this.key) || 5;
        if (key < 2) return text;
        
        const cleaned = text.replace(/\s/g, '').toUpperCase();
        if (cleaned.length === 0) return text;
        
        // Calculate number of rows
        const numRows = Math.ceil(cleaned.length / key);
        
        // Fill grid column by column (reverse of encoding)
        const grid = [];
        for (let i = 0; i < numRows; i++) {
            grid[i] = new Array(key);
        }
        
        let textIdx = 0;
        for (let j = 0; j < key; j++) {
            for (let i = 0; i < numRows && textIdx < cleaned.length; i++) {
                grid[i][j] = cleaned[textIdx++];
            }
        }
        
        // Read row by row
        let result = '';
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < key; j++) {
                if (grid[i][j]) {
                    result += grid[i][j];
                }
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[scytale]';
        const result = this.func(text.slice(0, 10));
        return result.substring(0, 12) + (result.length > 12 ? '...' : '');
    },
    detector: function(text) {
        // Scytale produces scrambled text - similar to columnar transposition
        const cleaned = text.replace(/[\s]/g, '').toUpperCase();
        if (cleaned.length < 10) return false;
        if (!/^[A-Z]+$/.test(cleaned)) return false;
        
        // Check if it looks scrambled (not readable English)
        const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU'];
        const hasCommonWords = commonWords.some(word => cleaned.includes(word));
        if (hasCommonWords && cleaned.length < 30) return false;
        
        return true;
    }
});

