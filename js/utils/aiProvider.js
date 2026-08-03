/**
 * Generic OpenAI-compatible chat-completions client, shared by every AI-backed
 * tool (Translate, PromptCraft, SpellingAlphabet, AntiClassifier, Decode).
 *
 * Ships with built-in presets for OpenRouter (default) and audn.ai, plus a
 * user-managed list of custom OpenAI-compatible providers (any base URL +
 * API key + model), so more than one alternate endpoint can be saved and
 * switched between.
 */
window.AIProvider = {
    SELECTED_STORAGE_KEY: 'ai-provider',
    CUSTOM_STORAGE_KEY: 'ai-custom-providers-v1',

    BUILTIN: [
        {
            id: 'openrouter',
            name: 'OpenRouter',
            baseUrl: 'https://openrouter.ai/api/v1',
            keyPlaceholder: 'sk-or-...',
            dynamicModels: true,
            builtin: true
        },
        {
            id: 'audn',
            name: 'audn.ai',
            baseUrl: 'https://platform.audn.ai/api/v1',
            keyPlaceholder: 'sk_live_...',
            dynamicModels: false,
            models: ['pingu-unchained-10', 'kong', 'godzilla', 'necromicon'],
            builtin: true
        }
    ],

    // ---- custom provider CRUD -------------------------------------------

    getCustomProviders: function() {
        try {
            var raw = localStorage.getItem(this.CUSTOM_STORAGE_KEY);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    },

    saveCustomProviders: function(list) {
        try {
            localStorage.setItem(this.CUSTOM_STORAGE_KEY, JSON.stringify(list || []));
        } catch (e) {
            console.warn('Failed to save custom AI providers:', e);
        }
    },

    genId: function() {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return 'custom:' + crypto.randomUUID();
        }
        return 'custom:' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
    },

    addCustomProvider: function(def) {
        var list = this.getCustomProviders();
        var entry = {
            id: this.genId(),
            name: (def.name || '').trim() || 'Custom provider',
            baseUrl: (def.baseUrl || '').trim().replace(/\/+$/, ''),
            apiKey: (def.apiKey || '').trim(),
            models: Array.isArray(def.models) ? def.models : (def.models ? String(def.models).split(',').map(function(s) { return s.trim(); }).filter(Boolean) : [])
        };
        list.push(entry);
        this.saveCustomProviders(list);
        return entry.id;
    },

    updateCustomProvider: function(id, patch) {
        var list = this.getCustomProviders();
        var found = false;
        list = list.map(function(p) {
            if (p.id !== id) return p;
            found = true;
            var next = Object.assign({}, p, patch);
            if (patch && typeof patch.baseUrl === 'string') {
                next.baseUrl = patch.baseUrl.trim().replace(/\/+$/, '');
            }
            if (patch && typeof patch.apiKey === 'string') {
                next.apiKey = patch.apiKey.trim();
            }
            if (patch && patch.models !== undefined) {
                next.models = Array.isArray(patch.models)
                    ? patch.models
                    : String(patch.models).split(',').map(function(s) { return s.trim(); }).filter(Boolean);
            }
            return next;
        });
        if (found) this.saveCustomProviders(list);
        return found;
    },

    removeCustomProvider: function(id) {
        var list = this.getCustomProviders().filter(function(p) { return p.id !== id; });
        this.saveCustomProviders(list);
        if (this.getSelectedId() === id) {
            this.setSelectedId('openrouter');
        }
    },

    // ---- lookup -----------------------------------------------------------

    getAllProviders: function() {
        return this.BUILTIN.concat(this.getCustomProviders());
    },

    getPreset: function(id) {
        id = id || this.getSelectedId();
        var all = this.getAllProviders();
        var found = all.filter(function(p) { return p.id === id; })[0];
        return found || this.BUILTIN[0];
    },

    // ---- selection ----------------------------------------------------------

    getSelectedId: function() {
        try {
            // Default: OpenRouter if the user already has a key saved there
            // (preserves original behavior for existing users), else 'openrouter'
            // as the standing default regardless.
            return localStorage.getItem(this.SELECTED_STORAGE_KEY) || 'openrouter';
        } catch (e) {
            return 'openrouter';
        }
    },

    setSelectedId: function(id) {
        try {
            localStorage.setItem(this.SELECTED_STORAGE_KEY, id);
        } catch (e) {
            console.warn('Failed to save selected AI provider:', e);
        }
    },

    getLabel: function(id) {
        return this.getPreset(id || this.getSelectedId()).name;
    },

    getBaseUrl: function(id) {
        return this.getPreset(id).baseUrl || '';
    },

    isCustomId: function(id) {
        return typeof id === 'string' && id.indexOf('custom:') === 0;
    },

    // ---- API keys -----------------------------------------------------------

    getApiKey: function(id) {
        id = id || this.getSelectedId();
        try {
            if (id === 'openrouter') {
                return (
                    localStorage.getItem('openrouter-api-key') ||
                    localStorage.getItem('plinyos-api-key') ||
                    localStorage.getItem('openrouter_api_key') ||
                    ''
                ).trim();
            }
            if (this.isCustomId(id)) {
                var preset = this.getPreset(id);
                return (preset && preset.apiKey || '').trim();
            }
            return (localStorage.getItem(id + '-api-key') || '').trim();
        } catch (e) {
            return '';
        }
    },

    setApiKey: function(id, key) {
        id = id || this.getSelectedId();
        key = (key || '').trim();
        try {
            if (id === 'openrouter') {
                localStorage.setItem('openrouter-api-key', key);
            } else if (this.isCustomId(id)) {
                this.updateCustomProvider(id, { apiKey: key });
            } else {
                localStorage.setItem(id + '-api-key', key);
            }
        } catch (e) {
            console.warn('Failed to save API key:', e);
        }
    },

    clearApiKey: function(id) {
        id = id || this.getSelectedId();
        try {
            if (id === 'openrouter') {
                localStorage.removeItem('openrouter-api-key');
                localStorage.removeItem('plinyos-api-key');
                localStorage.removeItem('openrouter_api_key');
            } else if (this.isCustomId(id)) {
                this.updateCustomProvider(id, { apiKey: '' });
            } else {
                localStorage.removeItem(id + '-api-key');
            }
        } catch (e) {
            console.warn('Failed to clear API key:', e);
        }
    },

    // ---- requests -----------------------------------------------------------

    endpointUrl: function(id) {
        var base = this.getBaseUrl(id);
        if (!base) return '';
        return base.replace(/\/+$/, '') + '/chat/completions';
    },

    /**
     * POST messages to the selected (or explicitly given) provider's
     * /chat/completions endpoint. Throws an Error with .status/.data set
     * on HTTP or API-level errors so callers can branch on status codes.
     */
    chatCompletion: async function(messages, opts) {
        opts = opts || {};
        var id = opts.provider || this.getSelectedId();
        var apiKey = opts.apiKey || this.getApiKey(id);
        var url = opts.url || this.endpointUrl(id);

        if (!url) {
            var noUrlErr = new Error('No API base URL configured for ' + this.getLabel(id) + '.');
            noUrlErr.userFacing = true;
            throw noUrlErr;
        }
        if (!apiKey) {
            var noKeyErr = new Error('No API key set for ' + this.getLabel(id) + '.');
            noKeyErr.userFacing = true;
            throw noKeyErr;
        }

        var headers = {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        };
        if (id === 'openrouter') {
            headers['HTTP-Referer'] = (typeof window !== 'undefined' && window.location.href) || 'https://p4rs3lt0ngv3.app';
            headers['X-Title'] = 'P4RS3LT0NGV3';
        }

        var body = {
            model: opts.model,
            messages: messages,
            temperature: opts.temperature != null ? opts.temperature : 0.2,
            max_tokens: opts.maxTokens || 4096
        };
        if (opts.responseFormat) {
            body.response_format = opts.responseFormat;
        }

        var resp = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        var data = null;
        try {
            data = await resp.json();
        } catch (parseErr) {
            var parseFailErr = new Error('Unexpected response from ' + this.getLabel(id) + ' (HTTP ' + resp.status + ')');
            parseFailErr.status = resp.status;
            throw parseFailErr;
        }

        if (!resp.ok || (data && data.error)) {
            var msg = (data && data.error)
                ? ((typeof data.error === 'string') ? data.error : (data.error.message || 'API error'))
                : ('HTTP ' + resp.status);
            var err = new Error(msg);
            err.status = resp.status;
            err.data = data;
            throw err;
        }

        return data;
    }
};
