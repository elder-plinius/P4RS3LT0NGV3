// EBCDIC encoding (IBM character encoding)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'EBCDIC',
    priority: 250,
    category: 'encoding',
    // EBCDIC to ASCII mapping (simplified - full EBCDIC has many variants)
    ebcdicToAscii: {
        0x40: 0x20, // Space
        0x4A: 0x21, // !
        0x4B: 0x22, // "
        0x4C: 0x23, // #
        0x4D: 0x24, // $
        0x4E: 0x25, // %
        0x4F: 0x26, // &
        0x50: 0x27, // '
        0x5A: 0x28, // (
        0x5B: 0x29, // )
        0x5C: 0x2A, // *
        0x5D: 0x2B, // +
        0x5E: 0x2C, // ,
        0x5F: 0x2D, // -
        0x60: 0x2E, // .
        0x61: 0x2F, // /
        0xF0: 0x30, // 0
        0xF1: 0x31, // 1
        0xF2: 0x32, // 2
        0xF3: 0x33, // 3
        0xF4: 0x34, // 4
        0xF5: 0x35, // 5
        0xF6: 0x36, // 6
        0xF7: 0x37, // 7
        0xF8: 0x38, // 8
        0xF9: 0x39, // 9
        0x7A: 0x3A, // :
        0x7B: 0x3B, // ;
        0x7C: 0x3C, // <
        0x7D: 0x3D, // =
        0x7E: 0x3E, // >
        0x7F: 0x3F, // ?
        0x81: 0x41, // A
        0x82: 0x42, // B
        0x83: 0x43, // C
        0x84: 0x44, // D
        0x85: 0x45, // E
        0x86: 0x46, // F
        0x87: 0x47, // G
        0x88: 0x48, // H
        0x89: 0x49, // I
        0x91: 0x4A, // J
        0x92: 0x4B, // K
        0x93: 0x4C, // L
        0x94: 0x4D, // M
        0x95: 0x4E, // N
        0x96: 0x4F, // O
        0x97: 0x50, // P
        0x98: 0x51, // Q
        0x99: 0x52, // R
        0xA2: 0x53, // S
        0xA3: 0x54, // T
        0xA4: 0x55, // U
        0xA5: 0x56, // V
        0xA6: 0x57, // W
        0xA7: 0x58, // X
        0xA8: 0x59, // Y
        0xA9: 0x5A, // Z
    },
    func: function(text) {
        // Convert ASCII to EBCDIC
        const asciiToEbcdic = {};
        for (const [ebcdic, ascii] of Object.entries(this.ebcdicToAscii)) {
            asciiToEbcdic[ascii] = parseInt(ebcdic);
        }
        
        let result = '';
        for (const char of text) {
            const code = char.charCodeAt(0);
            // Convert lowercase letters to uppercase before encoding (EBCDIC is uppercase-only)
            if (code >= 0x61 && code <= 0x7A) { // a-z
                const upperCode = code - 0x20; // Convert to A-Z
                if (asciiToEbcdic[upperCode] !== undefined) {
                    result += String.fromCharCode(asciiToEbcdic[upperCode]);
                } else {
                    result += char; // Keep unmapped characters
                }
            } else if (asciiToEbcdic[code] !== undefined) {
                result += String.fromCharCode(asciiToEbcdic[code]);
            } else {
                result += char; // Keep unmapped characters
            }
        }
        
        return result;
    },
    reverse: function(text) {
        let result = '';
        for (const char of text) {
            const code = char.charCodeAt(0);
            if (this.ebcdicToAscii[code] !== undefined) {
                result += String.fromCharCode(this.ebcdicToAscii[code]);
            } else {
                result += char; // Keep unmapped characters
            }
        }
        return result;
    },
    preview: function(text) {
        if (!text) return '[ebcdic]';
        return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
    },
    detector: function(text) {
        if (!text || text.length < 2) return false;
        
        // EBCDIC uses specific byte ranges for letters and numbers
        // Letters: 0x81-0xA9 (A-Z)
        // Numbers: 0xF0-0xF9 (0-9)
        // Punctuation: 0x40-0x7F range
        
        // Check for EBCDIC-specific character codes (letters and numbers)
        const hasEbcdicLetters = /[\x81-\x89\x91-\x99\xA2-\xA9]/.test(text); // A-Z in EBCDIC
        const hasEbcdicNumbers = /[\xF0-\xF9]/.test(text); // 0-9 in EBCDIC
        
        // Must have at least some EBCDIC-specific characters
        if (!hasEbcdicLetters && !hasEbcdicNumbers) return false;
        
        // Reject if text is already readable ASCII (common English words)
        // This prevents false positives on plain text
        const commonWords = /\b(the|and|for|are|but|not|you|all|can|her|was|one|our|out|day|get|has|him|his|how|man|new|now|old|see|two|way|who|boy|did|its|let|put|say|she|too|use)\b/i;
        if (commonWords.test(text)) return false;
        
        // Check if decoding produces text that looks like it was encoded
        // EBCDIC-encoded text, when decoded, should have readable ASCII
        // If the input is already readable ASCII, it's not EBCDIC
        const readableAscii = /^[\x20-\x7E\s]*$/.test(text);
        if (readableAscii && !hasEbcdicLetters && !hasEbcdicNumbers) {
            // If it's all readable ASCII and has no EBCDIC-specific codes, reject
            return false;
        }
        
        // Verify that at least some characters are in EBCDIC-specific ranges
        // For short strings, require at least 1 EBCDIC character
        // For longer strings, require at least 10% to be EBCDIC-specific
        const ebcdicChars = (text.match(/[\x81-\x89\x91-\x99\xA2-\xA9\xF0-\xF9]/g) || []).length;
        if (ebcdicChars === 0) return false;
        
        // For short strings (<= 20 chars), just need at least 1 EBCDIC char
        if (text.length <= 20) {
            return ebcdicChars >= 1;
        }
        
        // For longer strings, require at least 10% to be EBCDIC-specific
        const ebcdicRatio = ebcdicChars / text.length;
        return ebcdicRatio >= 0.1; // At least 10% must be EBCDIC-specific
    }
});

