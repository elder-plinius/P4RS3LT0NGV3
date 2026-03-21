/**
 * Splitter Tool - Split text into multiple copyable messages
 */
class SplitterTool extends Tool {
    constructor() {
        super({
            id: 'splitter',
            name: 'Splitter',
            icon: 'fa-grip-lines',
            title: 'Split text into multiple copyable messages',
            order: 7
        });
    }
    
    getVueData() {
        // Load category order (same as TransformTool)
        const categoryOrder = this.getCategoryOrder();
        
        return {
            // Message Splitter Tab
            splitterInput: '',
            splitterMode: 'word', // 'chunk', 'word', 'sentence', 'line', 'pattern', 'token'
            splitterChunkSize: 6,
            splitterWordSplitSide: 'left', // 'left' or 'right' for even-length words
            splitterWordSkip: 0, // number of words to skip between splits
            splitterMinWordLength: 2, // minimum word length to consider for splitting (skip shorter words)
            splitterSplitFirstWord: true, // whether to split the first word (true) or keep it whole (false)
            splitterCopyAsSingleLine: false, // copy as single line (true) or multiline (false)
            splitterTransforms: [''], // array of transform names to apply in sequence (start with one empty slot)
            splitterStartWrap: '',
            splitterEndWrap: '',
            splitterIteratorMarker: '{n}', // marker to replace with split number
            splitterCustomPattern: '', // regex pattern for custom pattern mode
            splitterPatternIncludeDelimiter: false, // include delimiter in split for pattern mode
            splitterTokenizer: 'cl100k', // tokenizer for token-based mode
            splitterTokenCount: 3, // token count per chunk for token-based mode
            splitterPreserveEmptyLines: false, // preserve empty lines for line/sentence modes
            splitMessages: [],
            categoryOrder: categoryOrder
        };
    }
    
    getCategoryOrder() {
        // Get all categories from transforms
        if (!window.transforms) return [];
        
        const categorySet = new Set();
        Object.values(window.transforms).forEach(transform => {
            if (transform.category) {
                categorySet.add(transform.category);
            }
        });
        
        const allCategories = Array.from(categorySet);
        const savedOrder = this.loadCategoryOrder();
        
        return this.mergeCategoryOrder(allCategories, savedOrder);
    }
    
    loadCategoryOrder() {
        try {
            const saved = localStorage.getItem('transformCategoryOrder');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load category order:', e);
        }
        return null;
    }
    
    mergeCategoryOrder(allCategories, savedOrder) {
        // Always ensure randomizer is last
        const categoriesWithoutRandomizer = allCategories.filter(c => c !== 'randomizer');
        
        if (!savedOrder || savedOrder.length === 0) {
            // Default: alphabetical, randomizer last
            const sorted = categoriesWithoutRandomizer.sort((a, b) => a.localeCompare(b));
            return [...sorted, 'randomizer'];
        }
        
        // Use saved order, but filter out categories that no longer exist and remove duplicates
        const validSavedOrder = savedOrder
            .filter(cat => allCategories.includes(cat))
            .filter((cat, index, arr) => arr.indexOf(cat) === index); // Remove duplicates
        
        // Find new categories not in saved order
        const newCategories = categoriesWithoutRandomizer.filter(cat => !validSavedOrder.includes(cat));
        
        // Build final order: saved order (filtered, deduplicated) + new categories (alphabetically) + randomizer
        const finalOrder = [...validSavedOrder];
        if (newCategories.length > 0) {
            finalOrder.push(...newCategories.sort((a, b) => a.localeCompare(b)));
        }
        
        // Ensure randomizer is always last and remove any duplicates
        const finalWithoutRandomizer = finalOrder.filter(c => c !== 'randomizer');
        const uniqueFinal = finalWithoutRandomizer.filter((cat, index, arr) => arr.indexOf(cat) === index);
        return [...uniqueFinal, 'randomizer'];
    }
    
    getVueMethods() {
        return {
            /**
             * Get display name for category (capitalized)
             */
            getCategoryDisplayName: function(category) {
                return category.charAt(0).toUpperCase() + category.slice(1);
            },
            /**
             * Set encapsulation start and end strings
             * @param {string} start - The start string
             * @param {string} end - The end string
             */
            setEncapsulation(start, end) {
                this.splitterStartWrap = start;
                this.splitterEndWrap = end;
            },

            /**
             * Handle transform change - auto-add next dropdown or collapse consecutive Nones
             * @param {number} index - The index of the transformation that changed
             */
            handleTransformChange(index) {
                const value = this.splitterTransforms[index];
                
                if (value && value !== '') {
                    // Transform was selected - add next dropdown if it doesn't exist
                    if (index === this.splitterTransforms.length - 1) {
                        this.splitterTransforms.push('');
                    }
                } else {
                    // Transform was set to None
                    // Check if previous dropdown is also None - if so, remove current one and collapse from previous position
                    if (index > 0) {
                        const prev = this.splitterTransforms[index - 1];
                        if (!prev || prev === '') {
                            // Collapse: remove this dropdown
                            this.splitterTransforms.splice(index, 1);
                        }
                    } else if (index === 0 && this.splitterTransforms.length === 1) {
                        // Only one dropdown and it's set to None - keep it as the starting dropdown
                        // Do nothing
                    } else if (index === 0 && this.splitterTransforms.length > 1) {
                        // First dropdown set to None, check if next is also None
                        const next = this.splitterTransforms[1];
                        if (!next || next === '') {
                            // Remove the first one
                            this.splitterTransforms.splice(0, 1);
                        }
                    }
                }
                
                // Ensure there's always at least one dropdown
                if (this.splitterTransforms.length === 0) {
                    this.splitterTransforms = [''];
                }
                
                // Force Vue to update
                this.$forceUpdate();
            },

            /**
             * Generate split messages from input text
             * Supports multiple modes: character chunks, split words, sentence, line, pattern, token
             */
            async generateSplitMessages() {
                // Clear previous output at the start
                this.splitMessages = [];

                const input = this.splitterInput;
                if (!input) {
                    return;
                }

                let chunks = [];

                if (this.splitterMode === 'chunk') {
                    // Character chunk mode
                    const chunkSize = Math.max(1, Math.min(500, this.splitterChunkSize || 6));
                    for (let i = 0; i < input.length; i += chunkSize) {
                        chunks.push(input.slice(i, i + chunkSize));
                    }
                } else if (this.splitterMode === 'sentence') {
                    // Sentence mode - split by sentence boundaries
                    const sentenceRegex = /[.!?]+/g;
                    const sentences = input.split(sentenceRegex).filter(s => s.trim().length > 0);
                    chunks = sentences.map(s => s.trim());
                } else if (this.splitterMode === 'line') {
                    // Line mode - split by newlines
                    chunks = input.split(/\r?\n/).filter(line => line.trim().length > 0 || this.splitterPreserveEmptyLines);
                } else if (this.splitterMode === 'pattern') {
                    // Custom pattern mode - split by regex
                    const pattern = this.splitterCustomPattern || '\\s+';
                    try {
                        const regex = new RegExp(pattern, 'g');
                        if (this.splitterPatternIncludeDelimiter) {
                            // Include delimiter
                            const parts = input.split(regex);
                            chunks = parts.filter(p => p.length > 0);
                        } else {
                            // Exclude delimiter
                            chunks = input.split(regex).filter(p => p.trim().length > 0);
                        }
                    } catch (e) {
                        console.error('Invalid regex pattern:', e);
                        this.showNotification('Invalid regex pattern', 'error', 'fas fa-exclamation-triangle');
                        return;
                    }
                } else if (this.splitterMode === 'token') {
                    // Token-based mode - split by token count
                    try {
                        if (!window.gptTok) {
                            window.gptTok = await import('https://cdn.jsdelivr.net/npm/gpt-tokenizer@2/+esm');
                        }
                        // Map UI names to library encoding names
                        // Note: p50k_base doesn't exist - using p50k_edit (for editing models like code-davinci-edit-001)
                        const map = { 
                            cl100k: 'cl100k_base', 
                            o200k: 'o200k_base', 
                            p50k: 'p50k_edit', // p50k_base doesn't exist in gpt-tokenizer
                            r50k: 'r50k_base' 
                        };
                        const enc = map[this.splitterTokenizer] || 'cl100k_base';
                        const tokenCount = Math.max(1, Math.min(1000, this.splitterTokenCount || 3));
                        
                        // Debug: Log encoding being used
                        console.log(`[Splitter] Using tokenizer: ${this.splitterTokenizer} -> ${enc}`);
                        console.log(`[Splitter] gptTok object:`, window.gptTok);
                        console.log(`[Splitter] encode function:`, window.gptTok?.encode);
                        
                        // Check if the library API is different - might need encoding-specific encoder
                        let tokens;
                        if (window.gptTok.get_encoding) {
                            // Alternative API: get_encoding(name) returns encoder object
                            const encoder = window.gptTok.get_encoding(enc);
                            if (!encoder) {
                                throw new Error(`Encoding ${enc} not found in library`);
                            }
                            tokens = encoder.encode(input);
                            console.log(`[Splitter] Using get_encoding API, got ${tokens.length} tokens`);
                        } else if (window.gptTok.encode) {
                            // Standard API: encode(text, encoding)
                            if (typeof window.gptTok.encode !== 'function') {
                                throw new Error('Tokenizer library not loaded correctly');
                            }
                            tokens = window.gptTok.encode(input, enc);
                            if (!Array.isArray(tokens)) {
                                throw new Error(`Tokenizer returned invalid result for ${enc}`);
                            }
                            console.log(`[Splitter] Using encode API, got ${tokens.length} tokens`);
                        } else {
                            throw new Error('Tokenizer library API not recognized');
                        }
                        
                        const tokenChunks = [];
                        for (let i = 0; i < tokens.length; i += tokenCount) {
                            const tokenChunk = tokens.slice(i, i + tokenCount);
                            let text;
                            if (window.gptTok.get_encoding) {
                                const encoder = window.gptTok.get_encoding(enc);
                                text = encoder.decode(tokenChunk);
                            } else {
                                text = window.gptTok.decode(tokenChunk, enc);
                            }
                            tokenChunks.push(text);
                        }
                        
                        console.log(`[Splitter] Split into ${tokenChunks.length} chunks using ${enc}`);
                        chunks = tokenChunks;
                    } catch (e) {
                        console.error('Tokenizer error:', e);
                        const errorMsg = e.message || 'Failed to tokenize text';
                        this.showNotification(`Tokenizer error: ${errorMsg}`, 'error', 'fas fa-exclamation-triangle');
                        return;
                    }
                } else if (this.splitterMode === 'word') {
                    // Word split mode - creates messages with pattern: secondHalf + wholeWords + firstHalf
                    // IMPORTANT: ALL words must be included in output, never filtered out
                    const words = input.match(/\S+/g) || [];
                    if (words.length === 0) return;
                    
                    const skipCount = Math.max(0, Math.min(20, this.splitterWordSkip || 0));
                    const minLength = Math.max(1, this.splitterMinWordLength || 2);
                    
                    // Process all words - only split words that meet minimum length
                    // Short words are kept whole but still included in the pattern
                    let wordsToProcess = words;
                    let prependToFirst = [];
                    
                    // Handle "Split First Word" option
                    if (!this.splitterSplitFirstWord && words.length > 0) {
                        prependToFirst = [words[0]];
                        wordsToProcess = words.slice(1);
                    }

                    // Build word processing array - track which words can be split vs kept whole
                    const wordData = wordsToProcess.map((word, idx) => {
                        const canSplit = word.length >= minLength && word.length > 1;
                        return {
                            word: word,
                            canSplit: canSplit,
                            index: idx
                        };
                    });

                    // Determine which words to split (only words that can be split)
                    const splittableWords = wordData.filter(w => w.canSplit);
                    if (splittableWords.length === 0) {
                        // No words can be split, output everything as one message
                        chunks.push([...prependToFirst, ...wordsToProcess].join(' '));
                        return;
                    }

                    // Determine split pattern based on splittable words only
                    const splitIndexes = new Set();
                    for (let i = 0; i < splittableWords.length; i++) {
                        if ((i % (skipCount + 1)) === 0) {
                            splitIndexes.add(splittableWords[i].index);
                        }
                    }

                    // Process all words and build split structure
                    const processedWords = wordData.map((wd, idx) => {
                        if (splitIndexes.has(idx) && wd.canSplit) {
                            // Split this word
                            let splitPos;
                            if (wd.word.length % 2 === 0) {
                                splitPos = wd.word.length / 2;
                            } else {
                                splitPos = this.splitterWordSplitSide === 'left' 
                                    ? Math.ceil(wd.word.length / 2) 
                                    : Math.floor(wd.word.length / 2);
                            }
                            return {
                                firstHalf: wd.word.slice(0, splitPos),
                                secondHalf: wd.word.slice(splitPos),
                                split: true
                            };
                        }
                        // Keep whole (either too short or skipped)
                        return { whole: wd.word, split: false };
                    });

                    // Build output messages
                    let currentMessage = [...prependToFirst];
                    let messageStarted = false;

                    for (let i = 0; i < processedWords.length; i++) {
                        const item = processedWords[i];
                        
                        if (item.split) {
                            if (!messageStarted) {
                                // First split word - add first half to current message
                                currentMessage.push(item.firstHalf);
                                chunks.push(currentMessage.join(' '));
                                currentMessage = [item.secondHalf];
                                messageStarted = true;
                            } else {
                                // Add first half to current message, then start new message with second half
                                currentMessage.push(item.firstHalf);
                                chunks.push(currentMessage.join(' '));
                                currentMessage = [item.secondHalf];
                            }
                        } else {
                            // Whole word - add to current message (ALL words included)
                            currentMessage.push(item.whole);
                        }
                    }

                    // Add any remaining message
                    if (currentMessage.length > 0) {
                        chunks.push(currentMessage.join(' '));
                    }
                }

                // Apply transformations in sequence (chaining)
                let processedChunks = chunks;
                if (this.splitterTransforms && this.splitterTransforms.length > 0) {
                    // Filter out empty transforms
                    const activeTransforms = this.splitterTransforms.filter(t => t && t !== '');
                    
                    if (activeTransforms.length > 0) {
                        // Apply each transformation in sequence
                        for (const transformName of activeTransforms) {
                            const selectedTransform = this.transforms.find(t => t.name === transformName);
                            if (selectedTransform && selectedTransform.func) {
                                processedChunks = processedChunks.map(chunk => {
                                    try {
                                        return selectedTransform.func(chunk);
                                    } catch (e) {
                                        console.error('Transform error:', e);
                                        return chunk;
                                    }
                                });
                            }
                        }
                    }
                }

                // Apply encapsulation with iterator replacement
                const start = this.splitterStartWrap || '';
                const end = this.splitterEndWrap || '';
                const marker = this.splitterIteratorMarker || '{n}';
                
                // Replace iterator marker with split number
                this.splitMessages = processedChunks.map((chunk, index) => {
                    const num = index + 1;
                    const startReplaced = start.replace(new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), num);
                    const endReplaced = end.replace(new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), num);
                    return `${startReplaced}${chunk}${endReplaced}`;
                });
            },
            
            /**
             * Copy all split messages to clipboard
             * Single line: merges messages into one continuous string (keeps encapsulation/transformations)
             * Multiline: copies messages separated by newlines
             */
            copyAllSplitMessages() {
                if (this.splitMessages.length === 0) return;
                
                if (this.splitterCopyAsSingleLine) {
                    // Merge all messages back together, keeping encapsulation and transformations
                    // Just join without newlines - all encapsulation/transformations are already in splitMessages
                    const merged = this.splitMessages.join('');
                    this.copyToClipboard(merged);
                } else {
                    // Copy all messages separated by newlines
                    const allMessages = this.splitMessages.join('\n');
                    this.copyToClipboard(allMessages);
                }
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SplitterTool;
} else {
    window.SplitterTool = SplitterTool;
}
