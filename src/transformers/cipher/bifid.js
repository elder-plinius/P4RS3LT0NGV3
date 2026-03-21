// bifid cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Bifid Cipher',
    priority: 60,
    category: 'cipher',
    period: 5, // Period for fractionation (default 5)
    // Standard Polybius square (5x5, I and J share same cell)
    square: [
        ['A', 'B', 'C', 'D', 'E'],
        ['F', 'G', 'H', 'I', 'K'],
        ['L', 'M', 'N', 'O', 'P'],
        ['Q', 'R', 'S', 'T', 'U'],
        ['V', 'W', 'X', 'Y', 'Z']
    ],
    func: function(text) {
        const period = parseInt(this.period) || 5;
        const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 0) return text;
        
        // Step 1: Convert to Polybius coordinates
        const coords = [];
        for (const char of cleaned) {
            let found = false;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (this.square[row][col] === char || (char === 'J' && this.square[row][col] === 'I')) {
                        coords.push({ row: row + 1, col: col + 1 });
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }
        
        // Step 2: Write coordinates in rows, then columns
        const rowSeq = coords.map(c => c.row).join('');
        const colSeq = coords.map(c => c.col).join('');
        
        // Step 3: Group by period and read pairs
        let result = '';
        for (let i = 0; i < rowSeq.length; i += period) {
            const rowChunk = rowSeq.substring(i, i + period);
            const colChunk = colSeq.substring(i, i + period);
            
            for (let j = 0; j < rowChunk.length; j++) {
                const row = parseInt(rowChunk[j]) - 1;
                const col = parseInt(colChunk[j]) - 1;
                if (row >= 0 && row < 5 && col >= 0 && col < 5) {
                    result += this.square[row][col];
                }
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const period = parseInt(this.period) || 5;
        const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 0) return text;
        
        // Step 1: Convert letters to coordinates
        const coords = [];
        for (const char of cleaned) {
            let found = false;
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    if (this.square[row][col] === char || (char === 'J' && this.square[row][col] === 'I')) {
                        coords.push({ row: row + 1, col: col + 1 });
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }
        
        // Step 2: Group by period, extract row and column sequences
        let rowSeq = '';
        let colSeq = '';
        
        for (let i = 0; i < coords.length; i += period) {
            const chunk = coords.slice(i, i + period);
            const chunkRowSeq = chunk.map(c => c.row).join('');
            const chunkColSeq = chunk.map(c => c.col).join('');
            rowSeq += chunkRowSeq;
            colSeq += chunkColSeq;
        }
        
        // Step 3: Pair up coordinates and convert back to letters
        let result = '';
        for (let i = 0; i < rowSeq.length && i < colSeq.length; i++) {
            const row = parseInt(rowSeq[i]) - 1;
            const col = parseInt(colSeq[i]) - 1;
            if (row >= 0 && row < 5 && col >= 0 && col < 5) {
                result += this.square[row][col];
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[bifid]';
        const result = this.func(text.slice(0, 5));
        return result.substring(0, 10) + (result.length > 10 ? '...' : '');
    },
    detector: function(text) {
        // Bifid produces scrambled text (all uppercase letters, no digits)
        const cleaned = text.replace(/[\s]/g, '').toUpperCase();
        if (cleaned.length < 10) return false;
        if (!/^[A-Z]+$/.test(cleaned)) return false;
        
        // Check if it looks scrambled (not readable English)
        const commonWords = ['THE', 'AND', 'FOR', 'ARE'];
        const hasCommonWords = commonWords.some(word => cleaned.includes(word));
        if (hasCommonWords && cleaned.length < 20) return false;
        
        return true;
    }
});

