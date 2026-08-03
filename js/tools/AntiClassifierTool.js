/**
 * Syntactic Anti-Classifier — linguistic transformations via configured AI providers (same keys as PromptCraft).
 */
class AntiClassifierTool extends Tool {
    constructor() {
        super({
            id: 'anticlassifier',
            name: 'Anti-Classifier',
            icon: 'fa-robot',
            title: 'Syntactic anti-classifier (AI-powered)',
            order: 12
        });
    }

    getVueData() {
        const savedTemp = parseFloat(localStorage.getItem('ac-temperature'));
        const acTemperature = Number.isFinite(savedTemp)
            ? Math.min(2, Math.max(0, savedTemp))
            : 0.7;
        return {
            acInput: '',
            acOutput: '',
            acError: '',
            acLexemeAnalysis: { totalFindings: 0, findings: [], summary: 'No Latin-root wording findings.' },
            acLoading: false,
            acModel: localStorage.getItem('ac-model') || 'openrouter/auto',
            acTemperature,
            acMaxTokens: 2000
        };
    }

    getVueMethods() {
        return {
            acGetApiKey: function() {
                var providerId = window.AIProvider.parseModelId(this.acModel).providerId;
                var key = window.AIProvider.keyForModel(this.acModel);
                if (!key && providerId === 'openrouter' && this.openrouterApiKey) {
                    key = this.openrouterApiKey;
                    window.AIProvider.setApiKey(providerId, key);
                }
                return (key || '').trim();
            },
            acGetSystemPrompt: function() {
                return (typeof window !== 'undefined' && window.ANTICLASSIFIER_SYSTEM_PROMPT)
                    ? window.ANTICLASSIFIER_SYSTEM_PROMPT
                    : '';
            },
            acRefreshLexemeAnalysis: function() {
                if (typeof window === 'undefined' || !window.LexemeAnalysis || typeof window.LexemeAnalysis.analyze !== 'function') {
                    this.acLexemeAnalysis = { totalFindings: 0, findings: [], summary: 'Lexeme analysis unavailable.' };
                    return;
                }
                this.acLexemeAnalysis = window.LexemeAnalysis.analyze(this.acInput);
            },
            acRun: async function() {
                const providerId = window.AIProvider.parseModelId(this.acModel).providerId;
                const providerLabel = window.AIProvider.labelForModel(this.acModel);
                const apiKey = this.acGetApiKey();
                if (!apiKey) {
                    this.acError = 'No API key found. Set your ' + providerLabel + ' key in Advanced Settings first.';
                    return;
                }
                if (!this.acInput.trim()) {
                    this.acError = 'Enter a prompt to analyze.';
                    return;
                }
                const systemPrompt = this.acGetSystemPrompt();
                if (!systemPrompt) {
                    this.acError = 'Anti-classifier system prompt failed to load.';
                    return;
                }

                this.acLoading = true;
                this.acError = '';
                this.acOutput = '';
                localStorage.setItem('ac-model', this.acModel);
                const rawT = Number(this.acTemperature);
                const temperature = Number.isFinite(rawT)
                    ? Math.min(2, Math.max(0, rawT))
                    : 0.7;
                localStorage.setItem('ac-temperature', String(temperature));

                try {
                    const data = await window.AIProvider.chatCompletion([
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: this.acInput }
                    ], {
                        provider: providerId,
                        apiKey: apiKey,
                        model: this.acModel,
                        temperature: temperature,
                        maxTokens: Math.max(100, Math.min(32000, Number(this.acMaxTokens) || 2000))
                    });

                    if (data.choices && data.choices[0] && data.choices[0].message) {
                        this.acOutput = (data.choices[0].message.content || '').trim();
                    } else {
                        throw new Error('Empty response from model.');
                    }
                } catch (e) {
                    if (e.status === 401) {
                        this.acError = 'Invalid API key. Check your ' + providerLabel + ' key in Advanced Settings.';
                    } else if (e.status === 402) {
                        this.acError = 'Insufficient credits on your ' + providerLabel + ' account.';
                    } else if (e.status === 403) {
                        this.acError = 'Access denied. Your key may lack permissions for this model.';
                    } else {
                        this.acError = e.message || 'Request failed.';
                    }
                } finally {
                    this.acLoading = false;
                }
            },
            acCopyOutput: function() {
                if (this.acOutput) {
                    this.copyToClipboard(this.acOutput);
                }
            },
            acGetLexemeAnalysis: function() {
                return this.acLexemeAnalysis || { totalFindings: 0, findings: [], summary: 'No Latin-root wording findings.' };
            },
            acNeutralizeInput: function() {
                const analysis = this.acGetLexemeAnalysis();
                if (!analysis.totalFindings || !window.LexemeAnalysis || typeof window.LexemeAnalysis.neutralizeText !== 'function') {
                    return;
                }
                this.acInput = window.LexemeAnalysis.neutralizeText(this.acInput, analysis);
                if (typeof this.showNotification === 'function') {
                    this.showNotification('Applied neutral Latin-root rewrites', 'success', 'fas fa-seedling');
                }
            },
            acApplyLexemeRewrite: function(term, rewrite) {
                if (!term || !rewrite) {
                    return;
                }
                const escapedTerm = String(term).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                this.acInput = this.acInput.replace(new RegExp('\\b' + escapedTerm + '\\b', 'i'), rewrite);
                if (typeof this.showNotification === 'function') {
                    this.showNotification('Applied rewrite for ' + term, 'success', 'fas fa-pen');
                }
            }
        };
    }

    getVueWatchers() {
        return {
            acInput: function() {
                if (typeof this.acRefreshLexemeAnalysis === 'function') {
                    this.acRefreshLexemeAnalysis();
                }
            }
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AntiClassifierTool;
} else {
    window.AntiClassifierTool = AntiClassifierTool;
}
