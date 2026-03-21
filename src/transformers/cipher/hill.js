// hill cipher transform (matrix-based cipher)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Hill Cipher',
    priority: 60,
    category: 'cipher',
    // Default 2x2 key matrix (must be invertible mod 26)
    key: [[3, 3], [2, 5]], // Default key matrix
    func: function(text) {
        const key = this.key || [[3, 3], [2, 5]];
        const matrixSize = key.length;
        
        // Prepare text: remove non-letters, pad with X if needed
        let prepared = text.toUpperCase().replace(/[^A-Z]/g, '');
        while (prepared.length % matrixSize !== 0) {
            prepared += 'X';
        }
        
        let result = '';
        
        // Process in blocks of matrixSize
        for (let i = 0; i < prepared.length; i += matrixSize) {
            const block = prepared.slice(i, i + matrixSize);
            const blockNums = block.split('').map(c => c.charCodeAt(0) - 65);
            
            // Multiply key matrix by block vector
            const resultNums = [];
            for (let row = 0; row < matrixSize; row++) {
                let sum = 0;
                for (let col = 0; col < matrixSize; col++) {
                    sum += key[row][col] * blockNums[col];
                }
                resultNums.push(sum % 26);
            }
            
            // Convert back to letters
            result += resultNums.map(n => String.fromCharCode(n + 65)).join('');
        }
        
        return result;
    },
    reverse: function(text) {
        const key = this.key || [[3, 3], [2, 5]];
        const matrixSize = key.length;
        
        // Calculate inverse matrix mod 26
        const invKey = this.getInverseMatrix(key);
        if (!invKey) {
            console.warn('Hill cipher key matrix is not invertible');
            return text;
        }
        
        let prepared = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (prepared.length % matrixSize !== 0) {
            prepared += 'X'.repeat(matrixSize - (prepared.length % matrixSize));
        }
        
        let result = '';
        
        for (let i = 0; i < prepared.length; i += matrixSize) {
            const block = prepared.slice(i, i + matrixSize);
            const blockNums = block.split('').map(c => c.charCodeAt(0) - 65);
            
            const resultNums = [];
            for (let row = 0; row < matrixSize; row++) {
                let sum = 0;
                for (let col = 0; col < matrixSize; col++) {
                    sum += invKey[row][col] * blockNums[col];
                }
                resultNums.push((sum % 26 + 26) % 26);
            }
            
            result += resultNums.map(n => String.fromCharCode(n + 65)).join('');
        }
        
        // Remove padding X's
        return result.replace(/X+$/, '');
    },
    getInverseMatrix: function(matrix) {
        // For 2x2 matrix: inverse = (1/det) * [[d, -b], [-c, a]]
        // where det = ad - bc
        if (matrix.length !== 2 || matrix[0].length !== 2) {
            return null; // Only support 2x2 for now
        }
        
        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[1][0];
        const d = matrix[1][1];
        
        const det = (a * d - b * c) % 26;
        if (det === 0 || this.gcd(det, 26) !== 1) {
            return null; // Matrix not invertible mod 26
        }
        
        // Find modular inverse of det mod 26
        const detInv = this.modInverse(det, 26);
        
        return [
            [(d * detInv) % 26, (-b * detInv + 26 * 26) % 26],
            [(-c * detInv + 26 * 26) % 26, (a * detInv) % 26]
        ];
    },
    gcd: function(a, b) {
        while (b !== 0) {
            [a, b] = [b, a % b];
        }
        return a;
    },
    modInverse: function(a, m) {
        // Extended Euclidean algorithm
        let [oldR, r] = [a, m];
        let [oldS, s] = [1, 0];
        
        while (r !== 0) {
            const quotient = Math.floor(oldR / r);
            [oldR, r] = [r, oldR - quotient * r];
            [oldS, s] = [s, oldS - quotient * s];
        }
        
        return (oldS % m + m) % m;
    },
    preview: function(text) {
        if (!text) return '[hill]';
        const result = this.func(text.slice(0, 4));
        return result.substring(0, 8) + '...';
    },
    detector: function(text) {
        const cleaned = text.replace(/[\s]/g, '').toUpperCase();
        return cleaned.length >= 4 && cleaned.length % 2 === 0 && /^[A-Z]+$/.test(cleaned);
    }
});

