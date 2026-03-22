// dovahzul transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Dovahzul (Dragon)',
    priority: 285,
    // Detector: Look for characteristic Dovahzul patterns (vowel expansions)
    // Dovahzul encoding expands vowels: a->ah, e->eh, i->ii, q->kw, x->ks
    // We need to detect when text actually looks like Dovahzul, not just contains these patterns
    detector: function(text) {
        if (!/[a-z]/i.test(text)) return false;
        
        const lowerInput = text.toLowerCase();
        const textLength = text.length;
        
        // Check for Dovahzul-specific patterns that are less common in regular English
        // 'kw' (from 'q') and 'ks' (from 'x') are strong indicators
        const strongPatterns = ['kw', 'ks'];
        let strongCount = 0;
        for (const pattern of strongPatterns) {
            const matches = lowerInput.match(new RegExp(pattern, 'g'));
            if (matches) strongCount += matches.length;
        }
        
        // Check for vowel expansions: 'ah', 'eh', 'ii'
        // These can appear anywhere in Dovahzul-encoded text
        const vowelExpansions = ['ah', 'eh', 'ii'];
        let expansionCount = 0;
        
        for (const pattern of vowelExpansions) {
            const matches = lowerInput.match(new RegExp(pattern, 'g'));
            if (matches) expansionCount += matches.length;
        }
        
        // Calculate pattern density
        const totalPatterns = strongCount + expansionCount;
        const patternDensity = totalPatterns / Math.max(textLength / 10, 1);
        
        // Strong patterns (kw/ks) are very rare in English - even 1 is a strong indicator
        if (strongCount >= 1) return true;
        
        // For vowel expansions, we need to be more careful to avoid false positives
        // Check if the patterns appear in positions that suggest Dovahzul encoding
        // rather than natural English words
        
        // Common English words that contain these patterns (false positives to avoid):
        const falsePositiveWords = ['what', 'that', 'when', 'where', 'which', 'while', 'this', 'with', 'think', 'thank', 'the', 'then', 'there', 'their', 'they'];
        const words = lowerInput.split(/\s+/);
        const hasFalsePositives = words.some(word => falsePositiveWords.some(fp => word.includes(fp)));
        
        // If we have false positive words and low pattern count, it's probably English
        if (hasFalsePositives && expansionCount < 3) return false;
        
        // Require sufficient pattern density to indicate Dovahzul encoding
        // For short text: need at least 1 pattern with density > 0.3
        // For longer text: need at least 2 patterns with density > 0.2
        const minPatterns = textLength < 30 ? 1 : 2;
        const minDensity = textLength < 30 ? 0.3 : 0.2;
        
        return expansionCount >= minPatterns && patternDensity >= minDensity;
    },
    
    map: {
            'a': 'ah', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'eh', 'f': 'f', 'g': 'g', 'h': 'h', 'i': 'ii',
            'j': 'j', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'kw', 'r': 'r',
            's': 's', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'ks', 'y': 'y', 'z': 'z',
            'A': 'AH', 'B': 'B', 'C': 'K', 'D': 'D', 'E': 'EH', 'F': 'F', 'G': 'G', 'H': 'H', 'I': 'II',
            'J': 'J', 'K': 'K', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'KW', 'R': 'R',
            'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'KS', 'Y': 'Y', 'Z': 'Z'
        },
        func: function(text) {
            return [...text.toLowerCase()].map(c => this.map[c] || c).join('');
        },
        reverse: function(text) {
            // Build reverse map from multi-character sequences to single chars
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value.toLowerCase()] = key.toLowerCase();
            }
            
            // Sort by length (longest first) to match multi-char sequences first
            const patterns = Object.keys(revMap).sort((a, b) => b.length - a.length);
            
            let result = text.toLowerCase();
            // Replace multi-character patterns with their original characters
            for (const pattern of patterns) {
                const regex = new RegExp(pattern, 'g');
                result = result.replace(regex, revMap[pattern]);
            }
            
            return result;
        }

});