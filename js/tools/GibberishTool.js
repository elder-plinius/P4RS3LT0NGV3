/**
 * Gibberish Tool - Generate gibberish dictionary and random/specific character removal
 */
class GibberishTool extends Tool {
    constructor() {
        super({
            id: 'gibberish',
            name: 'Gibberish',
            icon: 'fa-comments',
            title: 'Gibberish Generator',
            order: 9
        });
    }
    
    getVueData() {
        return {
            // Gibberish Dictionary
            gibberishInput: '',
            gibberishOutput: '',
            gibberishSeed: '',
            gibberishDictionary: '',
            gibberishChars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            gibberishMode: 'random',

            // Removal mode properties
            removalSubMode: 'random',
            removalInput: '',
            removalVariations: 10,
            removalMinLetters: 1,
            removalMaxLetters: 3,
            removalSeed: '',
            removalOutputs: [],
            
            removalSpecificInput: '',
            removalCharsToRemove: '',
            removalSpecificOutput: ''
        };
    }
    
    getVueMethods() {
        return {
            // Gibberish Logic - Seeded random number generator
            seededRandom(seed) {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            },

            /**
             * Generate gibberish from input sentence while maintaining structure
             * Creates a consistent dictionary mapping for words
             */
            sentenceToGibberish() {
                function generateGibberish(word, seed) {
                    const length = Math.max(4, word.length);
                    let gibberish = "";
                    const chars = this.gibberishChars;

                    for (let i = 0; i < length; i++) {
                        const randomValue = this.seededRandom(seed + i * 0.1);
                        gibberish += chars[Math.floor(randomValue * chars.length)];
                    }
                    return gibberish;
                }
                
                const src = String(this.gibberishInput || '');
                if (!src) { 
                    this.gibberishOutput = ''; 
                    return; 
                }

                const words = this.gibberishInput.match(/\b\w+\b/g) || [];
                const dictionary = {};
                let gibberishSentence = "";
                let wordIndex = 0;

                words.forEach((word) => {
                    const lowerWord = word.toLowerCase();
                    const seed =
                        this.gibberishSeed === ""
                            ? Math.random() * 100
                            : Number(this.gibberishSeed);

                    if (!dictionary[lowerWord]) {
                        const wordSeed = seed + wordIndex * 100;
                        dictionary[lowerWord] = generateGibberish.call(this, word, wordSeed);
                        wordIndex++;
                    }
                });

                let charIndex = 0;
                for (let i = 0; i < this.gibberishInput.length; i++) {
                    const char = this.gibberishInput[i];

                    if (/\w/.test(char)) {
                        let j = i;
                        while (
                            j < this.gibberishInput.length &&
                            /\w/.test(this.gibberishInput[j])
                        ) {
                            j++;
                        }

                        const word = this.gibberishInput.substring(i, j).toLowerCase();
                        gibberishSentence += dictionary[word];
                        i = j - 1;
                    } else {
                        gibberishSentence += char;
                    }
                }

                const dictionaryString = Object.entries(dictionary)
                    .map(([plain, gib]) => `"${plain}": "${gib}"`)
                    .join(", ");

                this.gibberishOutput = gibberishSentence;
                this.gibberishDictionary = '{' + dictionaryString + '}';
            },
            
            /**
             * Factory for creating seeded random number generators
             * @param {string} seedStr - Seed string for RNG
             * @returns {Function} Random number generator function
             */
            seededRandomFactory(seedStr) {
                if (!seedStr) return Math.random;
                let h = 1779033703 ^ seedStr.length;
                for (let i=0;i<seedStr.length;i++) {
                    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
                    h = (h << 13) | (h >>> 19);
                }
                return function() {
                    h = Math.imul(h ^ (h >>> 16), 2246822507);
                    h = Math.imul(h ^ (h >>> 13), 3266489909);
                    return ((h ^= h >>> 16) >>> 0) / 4294967296;
                };
            },
            
            /**
             * Generate random character removals from input text
             * Creates multiple variations with different random removals
             */
            generateRandomRemovals() {
                if (!this.removalInput.trim()) {
                    this.showNotification('Please enter text to process', 'error');
                    return;
                }
                
                const seed = this.removalSeed ? String(this.removalSeed) : String(Date.now());
                let rng = this.seededRandomFactory(seed);
                
                this.removalOutputs = [];
                const words = this.removalInput.split(/\s+/);
                
                for (let v = 0; v < this.removalVariations; v++) {
                    const modifiedWords = words.map(word => {
                        // Skip very short words or non-alphabetic
                        if (word.length <= 1 || !/[a-zA-Z]/.test(word)) {
                            return word;
                        }
                        
                        // Determine how many letters to remove for this word
                        const minRemove = Math.max(0, this.removalMinLetters);
                        const maxRemove = Math.min(word.length - 1, this.removalMaxLetters);
                        const numToRemove = minRemove + Math.floor(rng() * (maxRemove - minRemove + 1));
                        
                        if (numToRemove === 0) {
                            return word;
                        }
                        
                        // Get letter positions
                        const letters = word.split('').map((c, i) => ({ char: c, index: i }))
                            .filter(item => /[a-zA-Z]/.test(item.char));
                        
                        // Randomly select positions to remove
                        const toRemoveIndices = new Set();
                        const maxAttempts = numToRemove * 3;
                        let attempts = 0;
                        
                        while (toRemoveIndices.size < Math.min(numToRemove, letters.length) && attempts < maxAttempts) {
                            const randIdx = Math.floor(rng() * letters.length);
                            toRemoveIndices.add(letters[randIdx].index);
                            attempts++;
                        }
                        
                        // Build result by skipping removed indices
                        return word.split('').filter((_, i) => !toRemoveIndices.has(i)).join('');
                    });
                    
                    this.removalOutputs.push(modifiedWords.join(' '));
                }
                
                this.showNotification(`Generated ${this.removalOutputs.length} variations`, 'success');
            },
            
            /**
             * Remove specific characters from input text
             */
            generateSpecificRemoval() {
                if (!this.removalSpecificInput.trim()) {
                    this.showNotification('Please enter text to process', 'error');
                    return;
                }
                
                if (!this.removalCharsToRemove) {
                    this.showNotification('Please specify characters to remove', 'error');
                    return;
                }
                
                const charsToRemove = new Set(this.removalCharsToRemove.split(''));
                this.removalSpecificOutput = this.removalSpecificInput
                    .split('')
                    .filter(char => !charsToRemove.has(char))
                    .join('');
                
                this.showNotification('Characters removed', 'success');
            },
            
            /**
             * Copy all removal outputs to clipboard (one per line)
             */
            copyAllRemovals() {
                if (this.removalOutputs.length === 0) return;
                const allOutputs = this.removalOutputs.join('\n');
                this.copyToClipboard(allOutputs);
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GibberishTool;
} else {
    window.GibberishTool = GibberishTool;
}

