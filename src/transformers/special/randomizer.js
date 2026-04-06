// randomizer transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

        name: 'Random Mix',
    priority: 20,
    // Get a list of transforms suitable for randomization
        getRandomizableTransforms() {
            const suitable = [
                'base64', 'binary', 'hex', 'morse', 'rot13', 'caesar', 'atbash', 'rot5',
                'upside_down', 'bubble', 'small_caps', 'fullwidth', 'leetspeak', 'superscript', 'subscript',
                'quenya', 'tengwar', 'klingon', 'dovahzul', 'standard_galactic', 'elder_futhark',
                'hieroglyphics', 'ogham', 'mathematical', 'cursive', 'medieval',
                'monospace', 'greek', 'braille', 'alternating_case', 'reverse_words',
                'title_case', 'sentence_case', 'camel_case', 'snake_case', 'kebab_case', 'random_case',
                'regional_indicator', 'fraktur', 'cyrillic_stylized', 'katakana', 'hiragana', 'emoji_speak',
                'base58', 'base62', 'roman_numerals', 'vigenere', 'rail_fence', 'base64url'
            ];
            return suitable.filter(name => window.transforms[name]);
        },
        
        // Apply random transforms to each word in a sentence
        func: function(text, options = {}) {
            if (!text) return '';
            
            const {
                preservePunctuation = true,
                minTransforms = 2,
                maxTransforms = 5,
                allowRepeats = false
            } = options;
            
            // Split text into words while preserving punctuation
            const words = this.smartWordSplit(text);
            const availableTransforms = this.getRandomizableTransforms();
            
            if (availableTransforms.length === 0) return text;
            
            // Select random transforms to use
            const numTransforms = Math.min(
                Math.max(minTransforms, Math.floor(Math.random() * maxTransforms) + 1),
                availableTransforms.length
            );
            
            const selectedTransforms = [];
            const usedTransforms = new Set();
            
            for (let i = 0; i < numTransforms; i++) {
                let transform;
                do {
                    transform = availableTransforms[Math.floor(Math.random() * availableTransforms.length)];
                } while (!allowRepeats && usedTransforms.has(transform) && usedTransforms.size < availableTransforms.length);
                
                selectedTransforms.push(transform);
                usedTransforms.add(transform);
            }
            
            // Apply random transforms to words
            const transformedWords = words.map(wordObj => {
                if (wordObj.isWord) {
                    const randomTransform = selectedTransforms[Math.floor(Math.random() * selectedTransforms.length)];
                    const transform = window.transforms[randomTransform];
                    
                    try {
                        const transformed = transform.func(wordObj.text);
                        return {
                            ...wordObj,
                            text: transformed,
                            transform: transform.name,
                            originalTransform: randomTransform
                        };
                    } catch (e) {
                        console.error(`Error applying ${randomTransform} to "${wordObj.text}":`, e);
                        return wordObj;
                    }
                } else {
                    return wordObj; // Keep punctuation/spaces as-is
                }
            });
            
            // Reconstruct the text
            const result = transformedWords.map(w => w.text).join('');
            
            // Store transform mapping for decoding
            this.lastTransformMap = transformedWords
                .filter(w => w.isWord && w.originalTransform)
                .map(w => ({
                    original: w.text,
                    transform: w.originalTransform,
                    transformName: w.transform
                }));
            
            return result;
        },
        
        // Smart word splitting that preserves punctuation
        smartWordSplit: function(text) {
            const words = [];
            let currentWord = '';
            let isInWord = false;
            
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const isWordChar = /[a-zA-Z0-9]/.test(char);
                
                if (isWordChar) {
                    if (!isInWord && currentWord) {
                        // We were in punctuation/space, now starting a word
                        words.push({ text: currentWord, isWord: false });
                        currentWord = '';
                    }
                    currentWord += char;
                    isInWord = true;
                } else {
                    if (isInWord && currentWord) {
                        // We were in a word, now in punctuation/space
                        words.push({ text: currentWord, isWord: true });
                        currentWord = '';
                    }
                    currentWord += char;
                    isInWord = false;
                }
            }
            
            // Add the last segment
            if (currentWord) {
                words.push({ text: currentWord, isWord: isInWord });
            }
            
            return words;
        },
        
        preview: function(text) {
            return '[mixed transforms]';
        },
        
        // Note: No reverse function - this transform is non-reversible
        // because different random transforms are applied to different words
        
        // Get info about the last randomization
        getLastTransformInfo: function() {
            return this.lastTransformMap || [];
        }

});