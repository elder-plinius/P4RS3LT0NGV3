/**
 * Decode Tool - Universal decoder tool with AI language detection & translation
 */
class DecodeTool extends Tool {
    constructor() {
        super({
            id: 'decoder',
            name: 'Decoder',
            icon: 'fa-key',
            title: 'Universal Decoder (D)',
            order: 2
        });

        // Unicode block ranges for script detection
        this.scriptRanges = [
            { name: 'Arabic',     re: /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/ },
            { name: 'Chinese',    re: /[\u4E00-\u9FFF\u3400-\u4DBF]/ },
            { name: 'Japanese',   re: /[\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF]/ },
            { name: 'Korean',     re: /[\uAC00-\uD7AF\u1100-\u11FF\u3130-\u318F]/ },
            { name: 'Cyrillic',   re: /[\u0400-\u04FF\u0500-\u052F]/ },
            { name: 'Devanagari', re: /[\u0900-\u097F]/ },
            { name: 'Thai',       re: /[\u0E00-\u0E7F]/ },
            { name: 'Hebrew',     re: /[\u0590-\u05FF\uFB1D-\uFB4F]/ },
            { name: 'Greek',      re: /[\u0370-\u03FF\u1F00-\u1FFF]/ },
            { name: 'Tamil',      re: /[\u0B80-\u0BFF]/ },
            { name: 'Bengali',    re: /[\u0980-\u09FF]/ },
            { name: 'Georgian',   re: /[\u10A0-\u10FF\u2D00-\u2D2F]/ },
            { name: 'Armenian',   re: /[\u0530-\u058F]/ },
            { name: 'Ethiopic',   re: /[\u1200-\u137F]/ },
            { name: 'Tibetan',    re: /[\u0F00-\u0FFF]/ },
            { name: 'Khmer',      re: /[\u1780-\u17FF]/ },
            { name: 'Lao',        re: /[\u0E80-\u0EFF]/ },
            { name: 'Myanmar',    re: /[\u1000-\u109F]/ },
            { name: 'Sinhala',    re: /[\u0D80-\u0DFF]/ },
            { name: 'Telugu',     re: /[\u0C00-\u0C7F]/ },
            { name: 'Kannada',    re: /[\u0C80-\u0CFF]/ },
            { name: 'Malayalam',  re: /[\u0D00-\u0D7F]/ },
            { name: 'Gujarati',   re: /[\u0A80-\u0AFF]/ },
            { name: 'Gurmukhi',   re: /[\u0A00-\u0A7F]/ }
        ];

        // Latin-script language markers (common words/patterns)
        this.latinLangMarkers = [
            { name: 'Spanish',    markers: /\b(el|la|los|las|de|del|en|con|por|para|que|una?|es|está|son|como|pero|más|tiene|esta|puede|este|cada|desde|según|también|porque|entre|ya|muy|otro|otra|sobre|después|mismo|donde|cuando|hasta|aquí|ser|hacer|tiene|todas?|todos?|nos|nuestro|hemos)\b/i },
            { name: 'French',    markers: /\b(le|la|les|des|une?|est|sont|avec|dans|pour|sur|pas|que|qui|cette?|mais|nous|vous|leur|très|être|avoir|faire|tout|comme|ses|aux|peut|aussi|plus|encore|même|entre|après|sans|ici|notre|autre|deux|bien)\b/i },
            { name: 'German',    markers: /\b(der|die|das|ein|eine|ist|sind|und|oder|für|mit|auf|nicht|von|den|dem|des|sich|kann|werden|wird|haben|sein|auch|nach|über|wie|noch|aber|wenn|nur|mehr|schon|hier|sehr|alle|diese[rms]?|jede[rms]?|mein|dein)\b/i },
            { name: 'Portuguese', markers: /\b(o|os|uma?|uns|umas|é|são|com|em|para|por|que|não|como|mas|mais|tem|está|pode|este|esta|cada|desde|também|porque|entre|muito|outro|outra|sobre|depois|mesmo|onde|quando|até|aqui|ser|fazer|nosso|nossa|todos|todas)\b/i },
            { name: 'Italian',   markers: /\b(il|lo|la|gli|le|un|una|è|sono|di|del|della|in|con|per|che|non|come|ma|più|ha|sta|può|questo|questa|ogni|anche|perché|tra|fra|molto|altro|altra|dopo|stesso|dove|quando|fino|qui|essere|fare|nostro|nostra|tutti|tutte)\b/i },
            { name: 'Dutch',     markers: /\b(de|het|een|is|zijn|en|of|voor|met|op|niet|van|dat|die|maar|ook|als|kan|worden|wordt|heeft|nog|naar|bij|uit|tot|wel|veel|meer|deze|alle|dit|wat|hoe|waar|hier|zeer|ons|onze|hun)\b/i },
            { name: 'Turkish',   markers: /\b(bir|ve|bu|için|ile|var|olan|gibi|daha|çok|ama|ancak|sonra|değil|olarak|kadar|hem|her|bütün|hiç|nasıl|neden|nere[dy]e|şimdi|zaman|büyük|küçük|iyi|kötü|yeni|eski)\b/i },
            { name: 'Polish',    markers: /\b(jest|nie|się|na|to|za|ale|jak|już|tak|czy|może|tylko|jeszcze|bardzo|jego|jej|ich|ten|tego|więc|przez|pod|nad|między|tutaj|teraz|zawsze|nigdy|każdy|wszystko)\b/i },
            { name: 'Vietnamese', markers: /\b(là|và|của|có|được|không|một|những|các|này|cho|đã|với|người|trong|từ|đến|về|theo|như|khi|nếu|nhưng|cũng|rất|nhiều|hay|bởi|tại|đây|nào)\b/i },
            { name: 'Indonesian', markers: /\b(dan|yang|di|ini|itu|untuk|dengan|dari|tidak|adalah|pada|ke|juga|akan|sudah|ada|oleh|karena|mereka|kami|bisa|harus|lebih|sangat|satu|dua|banyak|semua|setiap|atau)\b/i },
            { name: 'Swahili',   markers: /\b(na|ya|wa|ni|kwa|katika|hii|hiyo|lakini|pia|sana|mtu|watu|nyumba|kazi|nchi|jambo|mambo|habari|rafiki|asante|karibu|kwamba|ambaye|kila|yote)\b/i },
            { name: 'Romanian',  markers: /\b(este|sunt|și|sau|pentru|cu|în|din|la|pe|nu|care|acest|această|dar|mai|poate|aici|acolo|foarte|toate|fiecare|nostru|noastră|după|când|unde|cum|despre|între)\b/i }
        ];
    }

    /**
     * Detect if text is in a foreign (non-English) language.
     * Returns { detected: true, language: 'Spanish', confidence: 'high'|'medium' } or null
     */
    detectLanguage(text) {
        if (!text || text.length < 8) return null;

        // Strip out common encoding artifacts before checking
        var clean = text.replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
        if (!clean) return null;

        // 1) Check non-Latin scripts via Unicode blocks
        for (var i = 0; i < this.scriptRanges.length; i++) {
            var script = this.scriptRanges[i];
            var matches = clean.match(new RegExp(script.re.source, 'g'));
            if (matches && matches.length >= 3) {
                var ratio = matches.length / clean.replace(/\s/g, '').length;
                if (ratio > 0.3) {
                    return { detected: true, language: script.name, confidence: 'high' };
                }
            }
        }

        // 2) Check Latin-script languages by word markers
        // Only check if text is mostly Latin characters
        var latinChars = clean.match(/[a-zA-ZÀ-ÿ]/g);
        if (!latinChars || latinChars.length / clean.replace(/\s/g, '').length < 0.5) return null;

        var words = clean.split(/\s+/).filter(function(w) { return w.length > 0; });
        if (words.length < 3) return null;

        // Check if text looks English first — skip detection if it does
        var englishMarkers = /\b(the|is|are|was|were|have|has|had|will|would|could|should|can|do|does|did|this|that|these|those|with|from|they|their|them|been|being|which|where|when|what|who|how|but|and|not|for|all|any|our|your|its|his|her|some|into|very|just|about|then|than|more|also|here|each|every|only|most|both|such|much|many|other|after|before|between|under|over|again|once|during|without)\b/gi;
        var engMatches = clean.match(englishMarkers);
        var engRatio = engMatches ? engMatches.length / words.length : 0;
        if (engRatio > 0.15) return null; // Likely English

        var bestLang = null;
        var bestScore = 0;

        for (var j = 0; j < this.latinLangMarkers.length; j++) {
            var lang = this.latinLangMarkers[j];
            var langMatches = clean.match(new RegExp(lang.markers.source, 'gi'));
            if (langMatches) {
                var score = langMatches.length / words.length;
                if (score > bestScore) {
                    bestScore = score;
                    bestLang = lang.name;
                }
            }
        }

        if (bestLang && bestScore > 0.1) {
            return {
                detected: true,
                language: bestLang,
                confidence: bestScore > 0.25 ? 'high' : 'medium'
            };
        }

        return null;
    }

    getVueData() {
        return {
            decoderInput: '',
            decoderOutput: '',
            decoderResult: null,
            selectedDecoder: 'auto',
            decoderLangDetected: null,
            decoderTranslating: false,
            decoderTranslateError: ''
        };
    }

    getVueMethods() {
        var self = this;
        return {
            getAllTransformsWithReverse: function() {
                return (typeof transformSelectFilter === 'function')
                    ? transformSelectFilter(this, true)
                    : this.transforms.filter(t => t && typeof t.reverse === 'function');
            },
            runUniversalDecode: function() {
                const input = this.decoderInput;
                this.decoderLangDetected = null;
                this.decoderTranslateError = '';

                if (!input) {
                    this.decoderOutput = '';
                    this.decoderResult = null;
                    return;
                }

                let result = null;

                if (this.selectedDecoder !== 'auto') {
                    const selectedTransform = this.transforms.find(t => t.name === this.selectedDecoder);
                    if (selectedTransform && selectedTransform.reverse) {
                        try {
                            const full = window.transforms && Object.values(window.transforms).find(function(tr) {
                                return tr.name === selectedTransform.name;
                            });
                            const opts = full && typeof window.getMergedTransformOptions === 'function'
                                ? window.getMergedTransformOptions(full)
                                : {};
                            const decoded = selectedTransform.reverse(input, opts);
                            if (decoded && decoded !== input) {
                                result = {
                                    text: decoded,
                                    method: selectedTransform.name,
                                    alternatives: []
                                };
                            }
                        } catch (e) {
                            console.error(`Error using manual decoder ${this.selectedDecoder}:`, e);
                        }
                    }
                } else {
                    result = window.universalDecode(input, {
                        activeTab: this.activeTab,
                        activeTransform: this.activeTransform
                    });
                }

                this.decoderResult = result;
                this.decoderOutput = result ? result.text : '';

                // Run language detection on the input (and on decoded output if different)
                var langDetect = self.detectLanguage(input);
                if (langDetect) {
                    this.decoderLangDetected = langDetect;
                } else if (result && result.text && result.text !== input) {
                    var decodedLang = self.detectLanguage(result.text);
                    if (decodedLang) {
                        this.decoderLangDetected = decodedLang;
                    }
                }
            },
            decoderTranslateToEnglish: async function() {
                var model = localStorage.getItem('translate-model') || 'google/gemma-3-27b-it';
                var providerId = window.AIProvider.parseModelId(model).providerId;
                var providerLabel = window.AIProvider.labelForModel(model);
                var apiKey = window.AIProvider.keyForModel(model);
                // Fallback: check Vue data property if localStorage is empty
                if (!apiKey && providerId === 'openrouter' && this.openrouterApiKey) {
                    apiKey = this.openrouterApiKey.trim();
                    window.AIProvider.setApiKey(providerId, apiKey);
                }
                if (!apiKey) {
                    this.decoderTranslateError = 'No API key. Set your ' + providerLabel + ' key in Advanced Settings.';
                    return;
                }

                var textToTranslate = this.decoderInput;
                var lang = this.decoderLangDetected ? this.decoderLangDetected.language : 'Unknown';

                this.decoderTranslating = true;
                this.decoderTranslateError = '';

                try {
                    var data = await window.AIProvider.chatCompletion([
                        {
                            role: 'system',
                            content: 'You are a professional translator. Translate the following text to English. ' +
                                'Output ONLY the English translation. No explanations, notes, or alternatives. ' +
                                'Preserve formatting, line breaks, and structure.'
                        },
                        {
                            role: 'user',
                            content: 'Translate this ' + lang + ' text to English:\n\n' + textToTranslate
                        }
                    ], {
                        provider: providerId,
                        apiKey: apiKey,
                        model: model,
                        temperature: 0.2,
                        maxTokens: 4096
                    });

                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        var translated = (data.choices[0].message.content || '').trim();
                        this.decoderOutput = translated;
                        this.decoderResult = {
                            text: translated,
                            method: lang + ' → English (AI)',
                            alternatives: this.decoderResult ? this.decoderResult.alternatives || [] : []
                        };
                        this.copyToClipboard(translated);
                    }
                } catch (e) {
                    this.decoderTranslateError = 'Translation failed: ' + e.message;
                } finally {
                    this.decoderTranslating = false;
                }
            },
            useAlternative: function(alternative) {
                if (alternative && alternative.text) {
                    this.decoderOutput = alternative.text;
                    this.decoderResult = {
                        method: alternative.method,
                        text: alternative.text,
                        alternatives: this.decoderResult.alternatives.filter(a => a.method !== alternative.method)
                    };
                }
            }
        };
    }

    getVueWatchers() {
        return {
            decoderInput() {
                this.runUniversalDecode();
            }
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DecodeTool;
} else {
    window.DecodeTool = DecodeTool;
}
