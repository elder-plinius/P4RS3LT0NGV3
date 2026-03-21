// klingon transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

        name: 'Klingon',
    priority: 100,
    map: {
            'a': 'a', 'b': 'b', 'c': 'ch', 'd': 'D', 'e': 'e', 'f': 'f', 'g': 'gh', 'h': 'H', 'i': 'I',
            'j': 'j', 'k': 'q', 'l': 'l', 'm': 'm', 'n': 'n', 'o': 'o', 'p': 'p', 'q': 'Q', 'r': 'r',
            's': 'S', 't': 't', 'u': 'u', 'v': 'v', 'w': 'w', 'x': 'x', 'y': 'y', 'z': 'z',
            'A': 'A', 'B': 'B', 'C': 'CH', 'D': 'D', 'E': 'E', 'F': 'F', 'G': 'GH', 'H': 'H', 'I': 'I',
            'J': 'J', 'K': 'Q', 'L': 'L', 'M': 'M', 'N': 'N', 'O': 'O', 'P': 'P', 'Q': 'Q', 'R': 'R',
            'S': 'S', 'T': 'T', 'U': 'U', 'V': 'V', 'W': 'W', 'X': 'X', 'Y': 'Y', 'Z': 'Z'
        },
        func: function(text) {
            // Process character by character, preserving case
            return [...text].map(c => this.map[c] || c).join('');
        },
        preview: function(text) {
            if (!text) return '[klingon]';
            return this.func(text.slice(0, 8));
        },
        reverse: function(text) {
            // Build reverse map with multi-character strings
            const revMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                revMap[value] = key;
            }
            // Try to match multi-character sequences first, then single chars
            let result = '';
            let i = 0;
            while (i < text.length) {
                // Try 2-character match first (for 'ch', 'gh', 'CH', 'GH')
                const twoChar = text.substr(i, 2);
                if (revMap[twoChar]) {
                    result += revMap[twoChar];
                    i += 2;
                } else if (revMap[text[i]]) {
                    result += revMap[text[i]];
                    i++;
                } else {
                    result += text[i];
                    i++;
                }
            }
            return result;
        },
        // Detector: Check for Klingon patterns
        detector: function(text) {
            // Klingon has characteristic patterns like 'ch', 'gh', 'Q' (capital Q for q sound)
            // Also uses capital letters in specific ways (D, H, I, Q, S)
            const patterns = text.match(/ch|gh|CH|GH/gi);
            const patternCount = patterns ? patterns.length : 0;
            
            // Check for Klingon-specific capital letter usage
            // Klingon uses capitals D, H, I, Q, S in specific contexts
            // But we need to avoid false positives from regular English
            const klingonCapitals = text.match(/[DHIQS]/g);
            const lowercaseLetters = text.match(/[a-z]/g);
            const hasQ = /Q/.test(text);
            
            // Strong indicators: 'ch' or 'gh' patterns
            if (patternCount >= 1) {
                const lowerText = text.toLowerCase();
                const commonEnglishPatterns = /(which|much|such|each|teach|reach|beach|church|chance|change|charm|chart|chase|cheap|check|cheek|cheer|cheese|chest|chick|chief|child|chill|china|chips|choke|choose|chop|chord|chore|chose|chuck|chunk|churn)/;
                const isCommonEnglish = commonEnglishPatterns.test(lowerText);
                
                // If we have multiple patterns, check if they're all in common English words
                if (patternCount >= 2) {
                    // If all patterns are in common English words, it's probably not Klingon
                    // Count how many patterns are NOT in common English contexts
                    const nonEnglishPatterns = patterns.filter(p => {
                        const patternLower = p.toLowerCase();
                        // Check if this pattern appears outside common English words
                        const patternIndex = lowerText.indexOf(patternLower);
                        if (patternIndex === -1) return false;
                        // Extract surrounding context
                        const start = Math.max(0, patternIndex - 5);
                        const end = Math.min(lowerText.length, patternIndex + patternLower.length + 5);
                        const context = lowerText.substring(start, end);
                        return !commonEnglishPatterns.test(context);
                    });
                    // If we have patterns outside common English words, it's likely Klingon
                    if (nonEnglishPatterns.length > 0) return true;
                    // Even if all patterns are in common words, Q or multiple capitals suggest Klingon
                    if (hasQ || (klingonCapitals && klingonCapitals.length >= 2)) return true;
                    // Otherwise, it's probably just English
                    return false;
                }
                
                // Single pattern
                // Single pattern with Q (strong Klingon indicator)
                if (hasQ) return true;
                // Single pattern with multiple Klingon capitals (indicates encoding)
                if (klingonCapitals && klingonCapitals.length >= 2) return true;
                // Single pattern is acceptable - 'ch' and 'gh' are less common in English
                // But avoid if it's clearly English (e.g., "ch" in "which", "much")
                if (!isCommonEnglish) return true;
                // Even if it's common English, if we have Q or multiple capitals, it might be Klingon
                if (hasQ || (klingonCapitals && klingonCapitals.length >= 2)) return true;
            }
            
            // Capital pattern: need multiple Klingon capitals mixed with lowercase
            // This indicates Klingon encoding, not just English with one capital letter
            if (klingonCapitals && lowercaseLetters && klingonCapitals.length >= 2) {
                // Check if capitals appear in middle/end of words (Klingon style)
                // This is different from English where capitals are usually at word start
                const midWordCapitals = text.match(/[a-z][DHIQS][a-z]/g);
                if (midWordCapitals && midWordCapitals.length >= 1) return true;
                // Or if Q is present (strong indicator)
                if (hasQ) return true;
            }
            
            // Single Q with lowercase is a strong indicator
            if (hasQ && lowercaseLetters && lowercaseLetters.length >= 2) return true;
            
            return false;
        }

});