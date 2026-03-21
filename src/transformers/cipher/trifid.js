// trifid cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Trifid Cipher',
    priority: 60,
    category: 'cipher',
    period: 5, // Period for fractionation (default 5)
    // Trifid uses a 3x3x3 cube (27 positions for A-Z and space/punctuation)
    // Structure: 3 layers, each with 3 rows and 3 columns
    cube: [
        // Layer 0
        [['A', 'B', 'C'], ['D', 'E', 'F'], ['G', 'H', 'I']],
        // Layer 1
        [['J', 'K', 'L'], ['M', 'N', 'O'], ['P', 'Q', 'R']],
        // Layer 2
        [['S', 'T', 'U'], ['V', 'W', 'X'], ['Y', 'Z', ' ']]
    ],
    func: function(text) {
        const period = parseInt(this.period) || 5;
        const cleaned = text.toUpperCase().replace(/[^A-Z ]/g, '');
        if (cleaned.length === 0) return text;
        
        // Step 1: Convert to Trifid coordinates (layer, row, col) - all 1-indexed
        const coords = [];
        for (const char of cleaned) {
            let found = false;
            for (let layer = 0; layer < 3; layer++) {
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        if (this.cube[layer] && this.cube[layer][row] && this.cube[layer][row][col] === char) {
                            coords.push({ layer: layer + 1, row: row + 1, col: col + 1 });
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (found) break;
            }
            if (!found && char === ' ') {
                coords.push({ layer: 3, row: 3, col: 3 }); // Space at layer 3, row 3, col 3
            }
        }
        
        // Step 2: Write coordinates in sequence, then group by period
        const layerSeq = coords.map(c => c.layer).join('');
        const rowSeq = coords.map(c => c.row).join('');
        const colSeq = coords.map(c => c.col).join('');
        
        // Step 3: Group by period and read triplets
        let result = '';
        for (let i = 0; i < layerSeq.length; i += period) {
            const layerChunk = layerSeq.substring(i, i + period);
            const rowChunk = rowSeq.substring(i, i + period);
            const colChunk = colSeq.substring(i, i + period);
            
            for (let j = 0; j < layerChunk.length; j++) {
                const layer = parseInt(layerChunk[j]) - 1;
                const row = parseInt(rowChunk[j]) - 1;
                const col = parseInt(colChunk[j]) - 1;
                
                if (layer >= 0 && layer < 3 && row >= 0 && row < 3 && col >= 0 && col < 3) {
                    if (this.cube[layer] && this.cube[layer][row] && this.cube[layer][row][col]) {
                        result += this.cube[layer][row][col];
                    }
                }
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const period = parseInt(this.period) || 5;
        const cleaned = text.toUpperCase().replace(/[^A-Z ]/g, '');
        if (cleaned.length === 0) return text;
        
        // Step 1: Convert letters to coordinates
        const coords = [];
        for (const char of cleaned) {
            let found = false;
            for (let layer = 0; layer < 3; layer++) {
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        if (this.cube[layer] && this.cube[layer][row] && this.cube[layer][row][col] === char) {
                            coords.push({ layer: layer + 1, row: row + 1, col: col + 1 });
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
                if (found) break;
            }
            if (!found && char === ' ') {
                coords.push({ layer: 3, row: 3, col: 3 });
            }
        }
        
        // Step 2: Group by period, extract sequences
        let layerSeq = '';
        let rowSeq = '';
        let colSeq = '';
        
        for (let i = 0; i < coords.length; i += period) {
            const chunk = coords.slice(i, i + period);
            const chunkLayerSeq = chunk.map(c => c.layer).join('');
            const chunkRowSeq = chunk.map(c => c.row).join('');
            const chunkColSeq = chunk.map(c => c.col).join('');
            layerSeq += chunkLayerSeq;
            rowSeq += chunkRowSeq;
            colSeq += chunkColSeq;
        }
        
        // Step 3: Pair up coordinates and convert back to letters
        let result = '';
        for (let i = 0; i < layerSeq.length && i < rowSeq.length && i < colSeq.length; i++) {
            const layer = parseInt(layerSeq[i]) - 1;
            const row = parseInt(rowSeq[i]) - 1;
            const col = parseInt(colSeq[i]) - 1;
            
            if (layer >= 0 && layer < 3 && row >= 0 && row < 3 && col >= 0 && col < 3) {
                if (this.cube[layer] && this.cube[layer][row] && this.cube[layer][row][col]) {
                    result += this.cube[layer][row][col];
                }
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[trifid]';
        const result = this.func(text.slice(0, 5));
        return result.substring(0, 10) + (result.length > 10 ? '...' : '');
    },
    detector: function(text) {
        // Trifid produces scrambled text (all uppercase letters, no digits)
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

