// baudot code / ITA2 encoding (teletype code)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Baudot Code (ITA2)',
    priority: 250,
    category: 'encoding',
    // Baudot/ITA2 5-bit code (letters and figures shift)
    letters: {
        0b00000: ' ', // NULL/blank
        0b00010: 'E',
        0b00011: '\n', // Line feed
        0b00100: 'A',
        0b00101: ' ',
        0b00110: 'S',
        0b00111: 'I',
        0b01000: 'U',
        0b01001: '\r', // Carriage return
        0b01010: 'D',
        0b01011: 'R',
        0b01100: 'J',
        0b01101: 'N',
        0b01110: 'F',
        0b01111: 'C',
        0b10000: 'K',
        0b10001: 'T',
        0b10010: 'Z',
        0b10011: 'L',
        0b10100: 'W',
        0b10101: 'H',
        0b10110: 'Y',
        0b10111: 'P',
        0b11000: 'Q',
        0b11001: 'O',
        0b11010: 'B',
        0b11011: 'G',
        0b11100: 'Figures', // Shift to figures
        0b11101: 'M',
        0b11110: 'X',
        0b11111: 'V',
    },
    figures: {
        0b00000: ' ',
        0b00010: '3',
        0b00011: '\n',
        0b00100: '-',
        0b00101: ' ',
        0b00110: '\'',
        0b00111: '8',
        0b01000: '7',
        0b01001: '\r',
        0b01010: '\u0005', // ENQ
        0b01011: '4',
        0b01100: '\'', // Bell
        0b01101: ',',
        0b01110: '!',
        0b01111: ':',
        0b10000: '(',
        0b10001: '5',
        0b10010: '+',
        0b10011: ')',
        0b10100: '2',
        0b10101: '$',
        0b10110: '6',
        0b10111: '0',
        0b11000: '1',
        0b11001: '9',
        0b11010: '?',
        0b11011: '&',
        0b11100: 'Letters', // Shift to letters
        0b11101: '.',
        0b11110: '/',
        0b11111: '=',
    },
    func: function(text) {
        // Create reverse maps
        const lettersToCode = {};
        const figuresToCode = {};
        for (const [code, char] of Object.entries(this.letters)) {
            if (char !== 'Figures' && char !== 'Letters') {
                lettersToCode[char] = parseInt(code);
            }
        }
        for (const [code, char] of Object.entries(this.figures)) {
            if (char !== 'Figures' && char !== 'Letters') {
                figuresToCode[char] = parseInt(code);
            }
        }
        
        let result = '';
        let inFigures = false;
        
        for (const char of text.toUpperCase()) {
            // Check if we need to shift
            const isFigure = /[0-9\-'():!$?&.\/+=]/.test(char);
            
            if (isFigure && !inFigures) {
                result += String.fromCharCode(0b11100); // Figures shift
                inFigures = true;
            } else if (!isFigure && inFigures) {
                result += String.fromCharCode(0b11111); // Letters shift (approximate)
                inFigures = false;
            }
            
            // Encode character
            const code = inFigures ? figuresToCode[char] : lettersToCode[char];
            if (code !== undefined) {
                result += String.fromCharCode(code);
            } else {
                result += char; // Keep unmapped
            }
        }
        
        return result;
    },
    reverse: function(text) {
        let result = '';
        let inFigures = false;
        
        for (let i = 0; i < text.length; i++) {
            const code = text.charCodeAt(i) & 0x1F; // 5 bits
            
            if (code === 0b11100) {
                inFigures = true;
                continue;
            } else if (code === 0b11111) {
                inFigures = false;
                continue;
            }
            
            const map = inFigures ? this.figures : this.letters;
            const char = map[code];
            if (char && char !== 'Figures' && char !== 'Letters') {
                result += char;
            }
        }
        
        return result;
    },
    preview: function(text) {
        if (!text) return '[baudot]';
        return this.func(text.slice(0, 5));
    },
    detector: function(text) {
        // Baudot uses 5-bit codes (0-31)
        // Check for characters in the 5-bit range
        const has5Bit = /[\x00-\x1F]/.test(text);
        return has5Bit && text.length >= 5;
    }
});

