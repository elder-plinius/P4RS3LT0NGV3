/**
 * Translate Tool - TranslateGemma-style translation via OpenRouter
 * Uses the official TranslateGemma prompt format for optimal translation quality.
 * TranslateGemma (google/translategemma-*) models are purpose-built for translation
 * from the Gemma 3 family. When available on OpenRouter, they'll be used directly.
 * For now, the TranslateGemma prompt template works excellently with standard Gemma 3
 * and Gemini models too.
 */
class TranslateTool extends Tool {
    constructor() {
        super({
            id: 'translate',
            name: 'Translate',
            icon: 'fa-language',
            title: 'AI-powered translation via TranslateGemma prompt format',
            order: 10
        });
        this.hidden = true;

        this.langCodeMap = {
            'Spanish': 'es', 'French': 'fr', 'German': 'de', 'Chinese': 'zh',
            'Japanese': 'ja', 'Korean': 'ko', 'Arabic': 'ar', 'Russian': 'ru',
            'Hindi': 'hi', 'Portuguese': 'pt', 'Italian': 'it', 'Dutch': 'nl',
            'Turkish': 'tr', 'Vietnamese': 'vi', 'Thai': 'th', 'Polish': 'pl',
            'Latin': 'la', 'Sanskrit': 'sa', 'Ancient Greek': 'grc',
            'Egyptian Arabic': 'arz', 'Old English': 'ang', 'Sumerian': 'sux',
            'Akkadian': 'akk', 'Hawaiian': 'haw', 'Welsh': 'cy', 'Swahili': 'sw',
            'Hebrew': 'he', 'Persian': 'fa', 'Tamil': 'ta', 'Esperanto': 'eo',
            'Irish': 'ga', 'Basque': 'eu', 'Navajo': 'nv', 'Quechua': 'qu',
            'Nahuatl': 'nah', 'Tagalog': 'tl', 'Maori': 'mi', 'Yoruba': 'yo',
            'Zulu': 'zu', 'Catalan': 'ca', 'Romanian': 'ro', 'Czech': 'cs',
            'Indonesian': 'id', 'Malay': 'ms', 'Bengali': 'bn', 'Urdu': 'ur'
        };
    }

    getVueData() {
        const savedCustom = JSON.parse(localStorage.getItem('pc-custom-langs') || '[]');
        return {
            translateLoading: false,
            translateError: '',
            translateActiveLang: '',
            translateModel: localStorage.getItem('translate-model') || 'google/gemma-3-27b-it',
            translateModels: [
                { id: 'google/gemma-3-27b-it', name: 'Gemma 3 27B', note: 'Best quality' },
                { id: 'google/gemma-3-12b-it', name: 'Gemma 3 12B', note: 'Fast + good' },
                { id: 'google/gemma-3-4b-it', name: 'Gemma 3 4B', note: 'Fastest' },
                { id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash', note: 'Google flagship' },
                { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', note: 'Stable' },
                { id: 'google/translategemma-27b-it', name: 'TranslateGemma 27B', note: 'Purpose-built (if available)' },
                { id: 'google/translategemma-12b-it', name: 'TranslateGemma 12B', note: 'Purpose-built (if available)' },
                { id: 'google/translategemma-4b-it', name: 'TranslateGemma 4B', note: 'Purpose-built (if available)' }
            ],
            translateMainLangs: [
                { code: 'es', name: 'Spanish', flag: 'ES' },
                { code: 'fr', name: 'French', flag: 'FR' },
                { code: 'de', name: 'German', flag: 'DE' },
                { code: 'zh', name: 'Chinese', flag: 'CN' },
                { code: 'ja', name: 'Japanese', flag: 'JP' },
                { code: 'ko', name: 'Korean', flag: 'KR' },
                { code: 'ar', name: 'Arabic', flag: 'SA' },
                { code: 'ru', name: 'Russian', flag: 'RU' },
                { code: 'hi', name: 'Hindi', flag: 'IN' },
                { code: 'pt', name: 'Portuguese', flag: 'PT' }
            ],
            translateExoticLangs: [
                { code: 'la', name: 'Latin', flag: 'VA', label: 'Dead' },
                { code: 'sa', name: 'Sanskrit', flag: 'IN', label: 'Ancient' },
                { code: 'grc', name: 'Ancient Greek', flag: 'GR', label: 'Ancient' },
                { code: 'arz', name: 'Egyptian Arabic', flag: 'EG', label: 'Regional' },
                { code: 'ang', name: 'Old English', flag: 'GB', label: 'Dead' },
                { code: 'sux', name: 'Sumerian', flag: 'IQ', label: 'Dead' },
                { code: 'akk', name: 'Akkadian', flag: 'IQ', label: 'Dead' },
                { code: 'haw', name: 'Hawaiian', flag: 'US', label: 'Endangered' },
                { code: 'cy', name: 'Welsh', flag: 'GB', label: 'Celtic' },
                { code: 'sw', name: 'Swahili', flag: 'KE', label: 'African' }
            ],
            translateCustomLangs: savedCustom,
            translateAddingLang: false,
            translateNewLangName: ''
        };
    }

    getVueMethods() {
        var self = this;
        return {
            translateGetApiKey: function() {
                var key = localStorage.getItem('openrouter-api-key') ||
                       localStorage.getItem('plinyos-api-key') ||
                       localStorage.getItem('openrouter_api_key') || '';
                // Fallback: if nothing in localStorage, check the Vue data property
                // (covers case where user typed key but forgot to click Save)
                if (!key && this.openrouterApiKey) {
                    key = this.openrouterApiKey;
                    // Auto-save it so future calls work
                    localStorage.setItem('openrouter-api-key', key.trim());
                }
                return key.trim();
            },
            translateGetLangCode: function(langName) {
                return self.langCodeMap[langName] || langName.toLowerCase().slice(0, 3);
            },
            translateBuildPrompt: function(langName, langCode, text) {
                // Use the official TranslateGemma prompt template format
                // This works well with all Gemma/Gemini models, not just TranslateGemma
                return 'You are a professional English (en) to ' + langName + ' (' + langCode + ') translator. ' +
                    'Your goal is to accurately convey the meaning and nuances of the original English text ' +
                    'while adhering to ' + langName + ' grammar, vocabulary, and cultural sensitivities. ' +
                    'Produce only the ' + langName + ' translation, without any additional explanations or commentary. ' +
                    'Please translate the following English text into ' + langName + ':\n\n' + text;
            },
            translateTo: async function(langName) {
                var apiKey = this.translateGetApiKey();
                if (!apiKey) {
                    this.translateError = 'No API key. Set your OpenRouter key in Advanced Settings in the top right.';
                    return;
                }
                var input = this.transformInput;
                if (!input || !input.trim()) {
                    this.translateError = 'Enter text in the input box first.';
                    return;
                }

                this.translateLoading = true;
                this.translateActiveLang = langName;
                this.translateError = '';
                localStorage.setItem('translate-model', this.translateModel);

                var langCode = this.translateGetLangCode(langName);
                var prompt = this.translateBuildPrompt(langName, langCode, input);
                var model = this.translateModel;

                // For TranslateGemma models, use their native format
                var isTranslateGemma = model.indexOf('translategemma') !== -1;
                var messages;
                if (isTranslateGemma) {
                    messages = [{ role: 'user', content: prompt }];
                } else {
                    messages = [
                        {
                            role: 'system',
                            content: 'You are a professional translator using the TranslateGemma translation protocol. ' +
                                'Output ONLY the translated text. No explanations, notes, preamble, or alternatives. ' +
                                'Preserve all formatting, line breaks, and structure.'
                        },
                        { role: 'user', content: prompt }
                    ];
                }

                try {
                    var resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + apiKey,
                            'Content-Type': 'application/json',
                            'HTTP-Referer': window.location.href || 'https://p4rs3lt0ngv3.app',
                            'X-Title': 'P4RS3LT0NGV3 TranslateGemma'
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: messages,
                            temperature: 0.2,
                            max_tokens: 4096
                        })
                    });

                    // Handle HTTP-level errors before parsing JSON
                    if (!resp.ok && resp.status === 401) {
                        this.translateError = 'Invalid API key. Check your OpenRouter key in Advanced Settings.';
                        return;
                    }
                    if (!resp.ok && resp.status === 402) {
                        this.translateError = 'Insufficient credits on your OpenRouter account. Add credits at openrouter.ai.';
                        return;
                    }
                    if (!resp.ok && resp.status === 403) {
                        this.translateError = 'Access denied. Your OpenRouter key may lack permissions for this model.';
                        return;
                    }

                    var data;
                    try {
                        data = await resp.json();
                    } catch (parseErr) {
                        this.translateError = 'Unexpected response from OpenRouter (HTTP ' + resp.status + ')';
                        return;
                    }

                    if (data.error) {
                        // If TranslateGemma model not found, fall back to Gemma 3 27B
                        if (isTranslateGemma && (data.error.code === 404 || data.error.code === 400 ||
                            (data.error.message && data.error.message.indexOf('not found') !== -1))) {
                            this.translateError = 'TranslateGemma not yet on OpenRouter — switching to Gemma 3 27B...';
                            this.translateModel = 'google/gemma-3-27b-it';
                            localStorage.setItem('translate-model', this.translateModel);
                            this.translateLoading = false;
                            this.translateActiveLang = '';
                            // Retry with fallback
                            await this.translateTo(langName);
                            return;
                        }
                        var errMsg = (typeof data.error === 'string') ? data.error :
                            (data.error.message || 'API error (code ' + (data.error.code || resp.status) + ')');
                        this.translateError = errMsg;
                    } else if (data.choices && data.choices[0]) {
                        var translated = data.choices[0].message.content.trim();
                        this.transformOutput = translated;
                        this.activeTransform = { name: langName + ' (' + langCode + ')', category: 'translate' };
                        this.copyToClipboard(translated);
                    } else {
                        this.translateError = 'No translation returned. Try a different model.';
                    }
                } catch (e) {
                    this.translateError = 'Translation failed: ' + (e.message || 'Network error. Check your connection.');
                } finally {
                    this.translateLoading = false;
                    this.translateActiveLang = '';
                }
            },
            translateAddCustomLang: function() {
                var name = this.translateNewLangName.trim();
                if (!name) return;
                if (this.translateCustomLangs.some(function(l) { return l.name.toLowerCase() === name.toLowerCase(); })) return;
                var code = self.langCodeMap[name] || name.toLowerCase().slice(0, 3);
                this.translateCustomLangs.push({ code: code, name: name, flag: '++' });
                localStorage.setItem('pc-custom-langs', JSON.stringify(this.translateCustomLangs));
                this.translateNewLangName = '';
                this.translateAddingLang = false;
            },
            translateRemoveCustomLang: function(index) {
                this.translateCustomLangs.splice(index, 1);
                localStorage.setItem('pc-custom-langs', JSON.stringify(this.translateCustomLangs));
            },
            translateGetFlag: function(code) {
                var flags = {
                    'ES': '\uD83C\uDDEA\uD83C\uDDF8', 'FR': '\uD83C\uDDEB\uD83C\uDDF7',
                    'DE': '\uD83C\uDDE9\uD83C\uDDEA', 'CN': '\uD83C\uDDE8\uD83C\uDDF3',
                    'JP': '\uD83C\uDDEF\uD83C\uDDF5', 'KR': '\uD83C\uDDF0\uD83C\uDDF7',
                    'SA': '\uD83C\uDDF8\uD83C\uDDE6', 'RU': '\uD83C\uDDF7\uD83C\uDDFA',
                    'IN': '\uD83C\uDDEE\uD83C\uDDF3', 'BR': '\uD83C\uDDE7\uD83C\uDDF7',
                    'VA': '\uD83C\uDDFB\uD83C\uDDE6', 'GR': '\uD83C\uDDEC\uD83C\uDDF7',
                    'EG': '\uD83C\uDDEA\uD83C\uDDEC', 'GB': '\uD83C\uDDEC\uD83C\uDDE7',
                    'IQ': '\uD83C\uDDEE\uD83C\uDDF6', 'US': '\uD83C\uDDFA\uD83C\uDDF8',
                    'KE': '\uD83C\uDDF0\uD83C\uDDEA', 'PT': '\uD83C\uDDF5\uD83C\uDDF9'
                };
                return flags[code] || '\uD83C\uDF10';
            }
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TranslateTool;
} else {
    window.TranslateTool = TranslateTool;
}
