/**
 * Glitch Tokens Utilities
 * Provides functions for loading and querying glitch token data
 */

window.GlitchTokenUtils = {
    // Global state
    _loaded: false,

    /**
     * Set glitch tokens data manually (for users who have their own data)
     */
    setGlitchTokensData(data) {
        window.glitchTokensData = data;
        this._loaded = true;
    },

    /**
     * Load glitch tokens data
     * Uses the data from glitchTokens.js, or allows manual override via setGlitchTokensData()
     */
    async loadGlitchTokens() {
        if (this._loaded && window.glitchTokensData) {
            return window.glitchTokensData;
        }

        // Use the data from glitchTokens.js (or override if setGlitchTokensData was called)
        if (!window.glitchTokensData) {
            // Fallback to empty structure if data file wasn't loaded
            window.glitchTokensData = {
                _metadata: {
                    name: 'AGGREGLITCH',
                    version: '1.0.0',
                    description: 'The Complete Glitch Token Library - All Known LLM Vocabulary Anomalies',
                    total_tokens_cataloged: 0,
                    last_updated: new Date().toISOString().split('T')[0]
                },
                behavior_categories: {},
                tokenizers: {},
                glitch_tokens: {}
            };
        }
        this._loaded = true;
        return window.glitchTokensData;
    },

    /**
     * Infer behavior from category or token context
     */
    _inferBehavior(token, category) {
        // If behavior is already set, use it
        if (token.behavior) {
            return token.behavior;
        }
        
        // Infer from category name
        const catLower = category.toLowerCase();
        if (catLower.includes('control') || catLower.includes('character')) {
            return 'CONTROL_CHARACTER';
        }
        if (catLower.includes('fragment') || catLower.includes('bpe') || catLower.includes('subtoken')) {
            return 'FRAGMENT';
        }
        if (catLower.includes('corrupted') || catLower.includes('unicode') || catLower.includes('mojibake')) {
            return 'CONTEXT_CORRUPTOR';
        }
        if (catLower.includes('syntax') || catLower.includes('code')) {
            return 'UNSPEAKABLE';
        }
        if (catLower.includes('special') || token.purpose) {
            return 'SPECIAL_TOKEN';
        }
        
        // Default to UNKNOWN if we can't infer
        return 'UNKNOWN';
    },

    /**
     * Recursively extract tokens from nested structures
     */
    _extractTokensFromValue(value, category, categoryDescription) {
        const tokens = [];
        
        if (Array.isArray(value)) {
            // If it's an array, check if items are token objects
            value.forEach(item => {
                if (item && typeof item === 'object') {
                    // Only extract if it has a 'token' property (actual token text)
                    // Skip items that only have token_id, meaning, examples, etc.
                    if (item.token !== undefined) {
                        const behavior = this._inferBehavior(item, category);
                        
                        tokens.push({
                            ...item,
                            behavior: behavior,
                            category: category,
                            categoryDescription: categoryDescription
                        });
                    } else {
                        // Recursively check nested structures (but skip if it's just metadata)
                        // Skip common metadata keys
                        if (!item.description && !item.source && !item.quote && !item.meaning && !item.purpose) {
                            tokens.push(...this._extractTokensFromValue(item, category, categoryDescription));
                        }
                    }
                }
            });
        } else if (value && typeof value === 'object') {
            // If it's an object, recursively check all values
            // Skip metadata objects (description, source, quote, etc.)
            if (value.description && !value.token && Object.keys(value).length <= 3) {
                // This is likely a metadata object, skip it
                return tokens;
            }
            
            for (const [key, val] of Object.entries(value)) {
                // Skip metadata keys
                if (key === 'description' || key === 'source' || key === 'quote' || key === 'why' || key === 'scandal') {
                    continue;
                }
                tokens.push(...this._extractTokensFromValue(val, category, categoryDescription));
            }
        }
        
        return tokens;
    },

    /**
     * Get all glitch tokens flattened into a single array
     */
    getAllGlitchTokens() {
        if (!window.glitchTokensData || !window.glitchTokensData.glitch_tokens) {
            console.warn('[GlitchTokens] No glitchTokensData found');
            return [];
        }

        const tokens = [];
        const glitchTokens = window.glitchTokensData.glitch_tokens;
        const categoryCount = Object.keys(glitchTokens).length;
        console.log(`[GlitchTokens] Processing ${categoryCount} categories`);

        // Iterate through all categories
        for (const [category, categoryData] of Object.entries(glitchTokens)) {
            // Skip metadata sections that don't contain tokens
            if (category === 'exploitation_techniques' || 
                category === 'detection_tools' || 
                category === 'statistics' ||
                category === 'centroid_phenomenon' ||
                category === 'special_system_tokens') {
                continue;
            }

            const categoryDescription = categoryData.description || categoryData.origin || '';
            
            // Handle categories with tokens array
            if (categoryData.tokens) {
                if (Array.isArray(categoryData.tokens)) {
                    // Simple array of tokens
                    categoryData.tokens.forEach(token => {
                        if (token && token.token !== undefined) {
                            const behavior = this._inferBehavior(token, category);
                            
                            tokens.push({
                                ...token,
                                behavior: behavior,
                                category: category,
                                categoryDescription: categoryDescription
                            });
                        }
                    });
                } else if (typeof categoryData.tokens === 'object') {
                    // Nested structure - recursively extract tokens
                    const extracted = this._extractTokensFromValue(
                        categoryData.tokens, 
                        category, 
                        categoryDescription
                    );
                    tokens.push(...extracted);
                }
            }
        }

        console.log(`[GlitchTokens] Extracted ${tokens.length} tokens total`);
        return tokens;
    },

    /**
     * Get tokens by behavior category
     */
    getTokensByBehavior(behavior) {
        const allTokens = this.getAllGlitchTokens();
        return allTokens.filter(token => token.behavior === behavior);
    },

    /**
     * Get tokens by tokenizer
     */
    getTokensByTokenizer(tokenizer) {
        const allTokens = this.getAllGlitchTokens();
        return allTokens.filter(token => {
            // Check if token has token_id for this tokenizer
            // This is a simplified check - actual implementation may need tokenizer-specific lookup
            return token.token_id !== undefined;
        });
    },

    /**
     * Search tokens by text or ID
     */
    searchGlitchTokens(query) {
        const allTokens = this.getAllGlitchTokens();
        const lowerQuery = query.toLowerCase();
        
        return allTokens.filter(token => {
            const tokenText = (token.token || '').toLowerCase();
            const origin = (token.origin || '').toLowerCase();
            const observedOutput = (token.observed_output || '').toLowerCase();
            const tokenId = String(token.token_id || '');
            
            return tokenText.includes(lowerQuery) ||
                   origin.includes(lowerQuery) ||
                   observedOutput.includes(lowerQuery) ||
                   tokenId.includes(lowerQuery);
        });
    }
};

// Expose functions on window for backward compatibility
if (typeof window !== 'undefined') {
    window.setGlitchTokensData = function(data) {
        window.GlitchTokenUtils.setGlitchTokensData(data);
    };
    window.loadGlitchTokens = function() {
        return window.GlitchTokenUtils.loadGlitchTokens();
    };
    window.getAllGlitchTokens = function() {
        return window.GlitchTokenUtils.getAllGlitchTokens();
    };
    window.getTokensByBehavior = function(behavior) {
        return window.GlitchTokenUtils.getTokensByBehavior(behavior);
    };
    window.getTokensByTokenizer = function(tokenizer) {
        return window.GlitchTokenUtils.getTokensByTokenizer(tokenizer);
    };
    window.searchGlitchTokens = function(query) {
        return window.GlitchTokenUtils.searchGlitchTokens(query);
    };
}

