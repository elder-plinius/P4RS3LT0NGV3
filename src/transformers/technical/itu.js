// ITU spelling alphabet transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'ITU Spelling Alphabet',
    priority: 200,
    category: 'technical',
    alphabet: {
        'A': 'AMSTERDAM', 'B': 'BALTIMORE', 'C': 'CASABLANCA', 'D': 'DANMARK', 'E': 'EDISON',
        'F': 'FLORIDA', 'G': 'GALLIPOLI', 'H': 'HAVANA', 'I': 'ITALIA', 'J': 'JERUSALEM',
        'K': 'KILOGRAMME', 'L': 'LIVERPOOL', 'M': 'MADRID', 'N': 'NEAPOLIS', 'O': 'OSLO',
        'P': 'PARIS', 'Q': 'QUEBEC', 'R': 'ROMA', 'S': 'SANTIAGO', 'T': 'TRIPOLI',
        'U': 'UPPSALA', 'V': 'VALENCIA', 'W': 'WASHINGTON', 'X': 'XANTIPPE', 'Y': 'YOKOHAMA',
        'Z': 'ZURICH'
    },
    func: function(text) {
        const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleaned.length === 0) return text;
        
        let result = '';
        for (const char of cleaned) {
            if (this.alphabet[char]) {
                result += this.alphabet[char] + ' ';
            } else {
                result += char + ' ';
            }
        }
        return result.trim();
    },
    reverse: function(text) {
        // Create reverse map
        const reverseMap = {};
        for (const [letter, word] of Object.entries(this.alphabet)) {
            reverseMap[word.toUpperCase()] = letter;
        }
        
        // Split by spaces and convert back
        const words = text.toUpperCase().split(/\s+/);
        let result = '';
        for (const word of words) {
            if (reverseMap[word]) {
                result += reverseMap[word];
            } else if (word.length === 1 && /[A-Z]/.test(word)) {
                result += word;
            }
        }
        return result;
    },
    preview: function(text) {
        if (!text) return '[itu]';
        return this.func(text.slice(0, 3));
    },
    detector: function(text) {
        // Check for ITU words
        const ituWords = ['AMSTERDAM', 'BALTIMORE', 'CASABLANCA', 'DANMARK', 'EDISON', 'FLORIDA', 'GALLIPOLI', 'HAVANA', 'ITALIA', 'JERUSALEM', 'KILOGRAMME', 'LIVERPOOL', 'MADRID', 'NEAPOLIS', 'OSLO', 'PARIS', 'QUEBEC', 'ROMA', 'SANTIAGO', 'TRIPOLI', 'UPPSALA', 'VALENCIA', 'WASHINGTON', 'XANTIPPE', 'YOKOHAMA', 'ZURICH'];
        const upper = text.toUpperCase();
        const matches = ituWords.filter(word => upper.includes(word));
        return matches.length >= 2;
    }
});

