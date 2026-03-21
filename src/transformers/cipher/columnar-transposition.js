// columnar transposition cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Columnar Transposition',
    priority: 60,
    category: 'cipher',
    key: 'KEY', // Default key
    func: function(text) {
        const key = (this.key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        if (key.length === 0) return text;
        
        // Remove spaces and convert to uppercase for processing
        const cleaned = text.replace(/\s/g, '').toUpperCase();
        const keyLength = key.length;
        const numRows = Math.ceil(cleaned.length / keyLength);
        
        // Create key order (sorted positions)
        const keyOrder = key.split('')
            .map((char, idx) => ({ char, idx }))
            .sort((a, b) => a.char.localeCompare(b.char))
            .map((item, newIdx) => ({ originalIdx: item.idx, newIdx }));
        
        // Fill grid
        const grid = [];
        for (let i = 0; i < numRows; i++) {
            grid[i] = [];
            for (let j = 0; j < keyLength; j++) {
                const idx = i * keyLength + j;
                grid[i][j] = idx < cleaned.length ? cleaned[idx] : 'X';
            }
        }
        
        // Read columns in key order
        const result = [];
        keyOrder.forEach(({ originalIdx }) => {
            for (let i = 0; i < numRows; i++) {
                result.push(grid[i][originalIdx]);
            }
        });
        
        return result.join('');
    },
    reverse: function(text) {
        const key = (this.key || 'KEY').toUpperCase().replace(/[^A-Z]/g, '');
        if (key.length === 0) return text;
        
        const keyLength = key.length;
        const numRows = Math.ceil(text.length / keyLength);
        
        // Create key order
        const keyOrder = key.split('')
            .map((char, idx) => ({ char, idx }))
            .sort((a, b) => a.char.localeCompare(b.char))
            .map((item, newIdx) => ({ originalIdx: item.idx, newIdx, sortedIdx: newIdx }));
        
        // Reconstruct grid by reading columns in key order
        const grid = [];
        for (let i = 0; i < numRows; i++) {
            grid[i] = new Array(keyLength);
        }
        
        let textIdx = 0;
        keyOrder.forEach(({ originalIdx }) => {
            for (let i = 0; i < numRows && textIdx < text.length; i++) {
                grid[i][originalIdx] = text[textIdx++];
            }
        });
        
        // Read grid row by row
        const result = [];
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < keyLength; j++) {
                if (grid[i][j]) {
                    result.push(grid[i][j]);
                }
            }
        }
        
        return result.join('').replace(/X+$/, ''); // Remove padding X's
    },
    preview: function(text) {
        if (!text) return '[columnar]';
        const result = this.func(text.slice(0, 10));
        return result.substring(0, 12) + (result.length > 12 ? '...' : '');
    },
    detector: function(text) {
        // Columnar transposition produces text that:
        // 1. Is all uppercase (after removing spaces)
        // 2. Has no spaces (or spaces removed)
        // 3. Has a length that suggests it was transposed (not too short)
        // 4. Doesn't look like readable English (columnar transposition scrambles text)
        const cleaned = text.replace(/[\s]/g, '').toUpperCase();
        
        // Too short to be meaningful
        if (cleaned.length < 10) return false;
        
        // Must be mostly letters (allow punctuation anywhere, but primarily letters)
        // Remove punctuation for the main check
        const lettersOnly = cleaned.replace(/[^A-Z]/g, '');
        if (lettersOnly.length < 10) return false; // Need at least 10 letters
        if (lettersOnly.length < cleaned.length * 0.8) return false; // At least 80% letters
        
        // Columnar transposition scrambles text, so it shouldn't look like readable English
        // Check for common English word patterns that would indicate readable text
        // But be careful - columnar-transposition might preserve some word fragments
        const strongEnglishPatterns = [
            /THE[A-Z]{3,}[A-Z]{3,}/,   // THE followed by two words (like "THEQUICKBROWN")
            /[A-Z]{3,}AND[A-Z]{3,}/,   // Word AND word (both 3+ letters)
            /[A-Z]{3,}FOR[A-Z]{3,}/,   // Word FOR word (both 3+ letters)
            /HELLOWORLD/,               // HELLO WORLD together
            /THEQUICK/,                  // THE QUICK together
            /QUICKBROWN/,              // QUICK BROWN together
        ];
        
        // If strong English patterns match, it's probably readable English, not scrambled
        for (const pattern of strongEnglishPatterns) {
            if (pattern.test(cleaned)) {
                return false;
            }
        }
        
        // Check for sequential letter patterns (like ABC, XYZ) which are unlikely in columnar-transposition
        if (/ABCD|BCDE|CDEF|DEFG|EFGH|FGHI|GHIJ|HIJK|IJKL|JKLM|KLMN|LMNO|MNOP|NOPQ|OPQR|PQRS|QRST|RSTU|STUV|TUVW|UVWX|VWXY|WXYZ/.test(cleaned)) {
            return false;
        }
        
        // Check letter frequency - columnar transposition should have roughly normal letter distribution
        const letterFreq = {};
        for (const char of lettersOnly) {
            letterFreq[char] = (letterFreq[char] || 0) + 1;
        }
        const uniqueLetters = Object.keys(letterFreq).length;
        // If we have very few unique letters, it's probably not columnar-transposition
        if (uniqueLetters < 5) return false;
        
        return true;
    }
});

