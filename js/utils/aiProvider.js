/**
 * Multi-provider AI client, shared by every AI-backed tool (Translate,
 * PromptCraft, SpellingAlphabet, AntiClassifier, Decode).
 *
 * Configure many providers at once (OpenRouter, OpenAI, Anthropic, Google,
 * audn.ai, or any custom endpoint); each keeps its own API key. Models are
 * addressed by a qualified id — "<providerId>::<modelId>" — so a single model
 * dropdown can span every configured provider with no "active provider" to
 * switch between. The provider is resolved from the model you pick.
 *
 * Two wire formats are supported:
 *   kind: 'openai'    → POST {baseUrl}/chat/completions      (OpenAI-compatible)
 *   kind: 'anthropic' → POST {baseUrl}/messages              (Anthropic Messages API)
 *
 * Google Gemini and OpenAI are reached through their OpenAI-compatible
 * endpoints, so they use the 'openai' adapter.
 */
window.AIProvider = {
    CUSTOM_STORAGE_KEY: 'ai-custom-providers-v2',
    SEP: '::',

    BUILTIN: [
        {
            id: 'openrouter',
            name: 'OpenRouter',
            kind: 'openai',
            baseUrl: 'https://openrouter.ai/api/v1',
            keyPlaceholder: 'sk-or-...',
            dynamicModels: true,
            builtin: true
        },
        {
            id: 'anthropic',
            name: 'Anthropic',
            kind: 'anthropic',
            baseUrl: 'https://api.anthropic.com/v1',
            keyPlaceholder: 'sk-ant-...',
            builtin: true,
            models: [
                'claude-opus-5',
                'claude-sonnet-5',
                'claude-haiku-4-5',
                'claude-opus-4-8'
            ]
        },
        {
            id: 'openai',
            name: 'OpenAI',
            kind: 'openai',
            baseUrl: 'https://api.openai.com/v1',
            keyPlaceholder: 'sk-...',
            builtin: true,
            models: ['gpt-5', 'gpt-5-mini', 'o3', 'gpt-4.1']
        },
        {
            id: 'google',
            name: 'Google Gemini',
            kind: 'openai', // via Gemini's OpenAI-compatible endpoint
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
            keyPlaceholder: 'AIza...',
            builtin: true,
            models: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemma-3-27b-it']
        },
        {
            id: 'audn',
            name: 'audn.ai',
            kind: 'openai',
            baseUrl: 'https://platform.audn.ai/api/v1',
            keyPlaceholder: 'sk_live_...',
            builtin: true,
            models: ['pingu-unchained-10', 'kong', 'godzilla', 'necromicon']
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
            return 'custom-' + crypto.randomUUID().slice(0, 8);
        }
        return 'custom-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    },

    parseModelList: function(models) {
        if (Array.isArray(models)) return models.slice();
        if (!models) return [];
        return String(models).split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    },

    addCustomProvider: function(def) {
        var list = this.getCustomProviders();
        var entry = {
            id: this.genId(),
            name: (def.name || '').trim() || 'Custom provider',
            kind: def.kind === 'anthropic' ? 'anthropic' : 'openai',
            baseUrl: (def.baseUrl || '').trim().replace(/\/+$/, ''),
            apiKey: (def.apiKey || '').trim(),
            models: this.parseModelList(def.models)
        };
        list.push(entry);
        this.saveCustomProviders(list);
        return entry.id;
    },

    updateCustomProvider: function(id, patch) {
        var self = this;
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
                next.models = self.parseModelList(patch.models);
            }
            return next;
        });
        if (found) this.saveCustomProviders(list);
        return found;
    },

    removeCustomProvider: function(id) {
        this.saveCustomProviders(this.getCustomProviders().filter(function(p) {
            return p.id !== id;
        }));
    },

    // ---- lookup -----------------------------------------------------------

    getAllProviders: function() {
        return this.BUILTIN.concat(this.getCustomProviders());
    },

    getProvider: function(id) {
        var all = this.getAllProviders();
        for (var i = 0; i < all.length; i++) {
            if (all[i].id === id) return all[i];
        }
        return null;
    },

    getLabel: function(id) {
        var p = this.getProvider(id);
        return p ? p.name : (id || 'provider');
    },

    isCustomId: function(id) {
        return typeof id === 'string' && id.indexOf('custom-') === 0;
    },

    // ---- qualified model ids ("providerId::modelId") ----------------------

    qualify: function(providerId, modelId) {
        return providerId + this.SEP + modelId;
    },

    /**
     * Split a qualified model id. Bare ids (no separator) are treated as
     * OpenRouter models so existing saved preferences keep working.
     */
    parseModelId: function(qualified) {
        var raw = String(qualified || '');
        var idx = raw.indexOf(this.SEP);
        if (idx === -1) {
            return { providerId: 'openrouter', modelId: raw };
        }
        return {
            providerId: raw.slice(0, idx),
            modelId: raw.slice(idx + this.SEP.length)
        };
    },

    // ---- API keys ---------------------------------------------------------

    getApiKey: function(providerId) {
        try {
            if (providerId === 'openrouter') {
                return (
                    localStorage.getItem('openrouter-api-key') ||
                    localStorage.getItem('plinyos-api-key') ||
                    localStorage.getItem('openrouter_api_key') ||
                    ''
                ).trim();
            }
            if (this.isCustomId(providerId)) {
                var p = this.getProvider(providerId);
                return ((p && p.apiKey) || '').trim();
            }
            return (localStorage.getItem(providerId + '-api-key') || '').trim();
        } catch (e) {
            return '';
        }
    },

    setApiKey: function(providerId, key) {
        key = (key || '').trim();
        try {
            if (providerId === 'openrouter') {
                localStorage.setItem('openrouter-api-key', key);
            } else if (this.isCustomId(providerId)) {
                this.updateCustomProvider(providerId, { apiKey: key });
            } else {
                localStorage.setItem(providerId + '-api-key', key);
            }
        } catch (e) {
            console.warn('Failed to save API key:', e);
        }
    },

    clearApiKey: function(providerId) {
        // Drop the cached catalog too — it was fetched with the old key.
        delete this._fetched[providerId];
        try {
            localStorage.removeItem(this.MODEL_CACHE_PREFIX + providerId);
        } catch (e) { /* ignore */ }
        try {
            if (providerId === 'openrouter') {
                localStorage.removeItem('openrouter-api-key');
                localStorage.removeItem('plinyos-api-key');
                localStorage.removeItem('openrouter_api_key');
            } else if (this.isCustomId(providerId)) {
                this.updateCustomProvider(providerId, { apiKey: '' });
            } else {
                localStorage.removeItem(providerId + '-api-key');
            }
        } catch (e) {
            console.warn('Failed to clear API key:', e);
        }
    },

    hasApiKey: function(providerId) {
        return !!this.getApiKey(providerId);
    },

    /** Key for whichever provider owns this qualified model id. */
    keyForModel: function(qualifiedModelId) {
        return this.getApiKey(this.parseModelId(qualifiedModelId).providerId);
    },

    /** Display name for whichever provider owns this qualified model id. */
    labelForModel: function(qualifiedModelId) {
        return this.getLabel(this.parseModelId(qualifiedModelId).providerId);
    },

    /** Providers with a key saved — the ones whose models are usable. */
    getConfiguredProviders: function() {
        var self = this;
        return this.getAllProviders().filter(function(p) {
            return self.hasApiKey(p.id);
        });
    },

    // ---- live model catalogs ----------------------------------------------

    MODEL_CACHE_PREFIX: 'ai-models-cache-',
    MODEL_CACHE_TTL_MS: 60 * 60 * 1000,

    /** Per-session catalogs fetched from provider /models endpoints. */
    _fetched: {},

    loadModelCache: function(providerId, apiKey) {
        try {
            var raw = localStorage.getItem(this.MODEL_CACHE_PREFIX + providerId);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (parsed.apiKey !== (apiKey || '')) return null;
            if (Date.now() - parsed.fetchedAt > this.MODEL_CACHE_TTL_MS) return null;
            return Array.isArray(parsed.models) && parsed.models.length ? parsed.models : null;
        } catch (e) {
            return null;
        }
    },

    saveModelCache: function(providerId, apiKey, models) {
        try {
            localStorage.setItem(this.MODEL_CACHE_PREFIX + providerId, JSON.stringify({
                apiKey: apiKey || '',
                fetchedAt: Date.now(),
                models: models
            }));
        } catch (e) {
            console.warn('Failed to cache models for ' + providerId + ':', e);
        }
    },

    /**
     * Model ids that clearly aren't chat models. Provider /models endpoints
     * return embeddings, image, audio, and moderation models too; those would
     * only clutter a dropdown that exists to pick a chat model.
     */
    _isChatModel: function(id) {
        return !/embed|whisper|tts|dall-e|imagen|veo|moderation|rerank|audio|realtime|transcribe|image-generation|aqa/i.test(id);
    },

    /**
     * Fetch a provider's live model list. Returns [{id, name}], or null if the
     * provider has no usable endpoint / the call fails — callers fall back to
     * the provider's declared list, so this never hard-fails the dropdown.
     */
    fetchModels: async function(providerId, options) {
        options = options || {};
        var provider = this.getProvider(providerId);
        if (!provider || providerId === 'openrouter') return null; // OpenRouter has its own path
        var apiKey = this.getApiKey(providerId);
        if (!apiKey || !provider.baseUrl) return null;

        if (!options.force) {
            var cached = this.loadModelCache(providerId, apiKey);
            if (cached) {
                this._fetched[providerId] = cached;
                return cached;
            }
        }

        var url = provider.baseUrl.replace(/\/+$/, '') + '/models';
        var headers = provider.kind === 'anthropic'
            ? {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            }
            : { 'Authorization': 'Bearer ' + apiKey };

        var resp = await fetch(url, { headers: headers });
        if (!resp.ok) {
            var err = new Error(provider.name + ' model list failed (HTTP ' + resp.status + ')');
            err.status = resp.status;
            throw err;
        }
        var json = await resp.json();

        var self = this;
        var models = (json.data || [])
            .map(function(m) {
                // Gemini returns ids as "models/gemini-2.5-pro"
                var id = String(m.id || '').replace(/^models\//, '');
                return { id: id, name: m.display_name || id };
            })
            .filter(function(m) { return m.id && self._isChatModel(m.id); });

        if (!models.length) return null;
        models.sort(function(a, b) { return a.id.localeCompare(b.id); });

        this._fetched[providerId] = models;
        this.saveModelCache(providerId, apiKey, models);
        return models;
    },

    /** Live catalog if we have one, else the provider's declared list. */
    modelsFor: function(provider) {
        var live = this._fetched[provider.id];
        if (live && live.length) return live;
        return (provider.models || []).map(function(id) {
            return { id: id, name: id };
        });
    },

    /**
     * Every usable model across every configured provider, as dropdown rows.
     * OpenRouter's live catalog is passed in (it's fetched via OpenRouterModels,
     * which also handles curation); everyone else uses their fetched-or-declared
     * list.
     */
    getAllModels: function(openRouterCatalog) {
        var self = this;
        var rows = [];
        this.getConfiguredProviders().forEach(function(p) {
            if (p.id === 'openrouter') {
                (openRouterCatalog || []).forEach(function(m) {
                    rows.push(Object.assign({}, m, {
                        id: self.qualify(p.id, m.id),
                        modelId: m.id,
                        providerId: p.id,
                        providerName: p.name
                    }));
                });
                return;
            }
            self.modelsFor(p).forEach(function(m) {
                rows.push({
                    id: self.qualify(p.id, m.id),
                    modelId: m.id,
                    name: m.name,
                    providerId: p.id,
                    providerName: p.name
                });
            });
        });
        return rows;
    },

    // ---- requests ---------------------------------------------------------

    /**
     * POST a chat completion. `opts.model` is a qualified id; the provider and
     * wire format are resolved from it. Throws an Error with .status/.data set
     * so callers can branch on status codes.
     */
    chatCompletion: async function(messages, opts) {
        opts = opts || {};
        var parsed = this.parseModelId(opts.model);
        var providerId = opts.provider || parsed.providerId;
        var modelId = parsed.modelId;
        var provider = this.getProvider(providerId);

        if (!provider) {
            var noProv = new Error('Unknown provider "' + providerId + '". Check Settings → AI Providers.');
            noProv.userFacing = true;
            throw noProv;
        }

        var apiKey = opts.apiKey || this.getApiKey(providerId);
        if (!provider.baseUrl) {
            var noUrl = new Error('No API base URL configured for ' + provider.name + '.');
            noUrl.userFacing = true;
            throw noUrl;
        }
        if (!apiKey) {
            var noKey = new Error('No API key set for ' + provider.name + '.');
            noKey.userFacing = true;
            throw noKey;
        }

        return provider.kind === 'anthropic'
            ? this._anthropicCall(provider, apiKey, modelId, messages, opts)
            : this._openaiCall(provider, apiKey, modelId, messages, opts);
    },

    /** OpenAI-compatible: OpenRouter, OpenAI, Google, audn.ai, custom. */
    _openaiCall: async function(provider, apiKey, modelId, messages, opts) {
        var headers = {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
        };
        if (provider.id === 'openrouter') {
            headers['HTTP-Referer'] = (typeof window !== 'undefined' && window.location.href) || 'https://p4rs3lt0ngv3.app';
            headers['X-Title'] = 'P4RS3LT0NGV3';
        }

        var body = {
            model: modelId,
            messages: messages,
            max_tokens: opts.maxTokens || 4096
        };
        if (opts.temperature != null) body.temperature = opts.temperature;
        if (opts.responseFormat) body.response_format = opts.responseFormat;

        var resp = await fetch(provider.baseUrl.replace(/\/+$/, '') + '/chat/completions', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        var data = await this._parseJson(resp, provider.name);
        this._throwIfError(resp, data, provider.name);
        return data;
    },

    /**
     * Anthropic Messages API. Differs from OpenAI in four ways that matter:
     *   - auth is x-api-key (not Bearer) + a required anthropic-version
     *   - browser calls need anthropic-dangerous-direct-browser-access for CORS
     *   - `system` is a top-level string, not a message with role "system"
     *   - current models (Opus 5 / Sonnet 5 / Opus 4.7+) reject `temperature`
     *     with a 400, so it is never sent
     * The response is normalized to OpenAI's `choices[0].message.content`
     * shape so every caller can read one format.
     */
    _anthropicCall: async function(provider, apiKey, modelId, messages, opts) {
        // Hoist system turns out of the messages array
        var system = '';
        var convo = [];
        (messages || []).forEach(function(m) {
            if (m.role === 'system') {
                system += (system ? '\n\n' : '') + m.content;
            } else {
                convo.push({ role: m.role, content: m.content });
            }
        });

        var body = {
            model: modelId,
            messages: convo,
            max_tokens: opts.maxTokens || 4096 // required by Anthropic
        };
        if (system) body.system = system;

        var resp = await fetch(provider.baseUrl.replace(/\/+$/, '') + '/messages', {
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        var data = await this._parseJson(resp, provider.name);
        this._throwIfError(resp, data, provider.name);

        if (data.stop_reason === 'refusal') {
            var refusal = new Error('Claude declined this request' +
                (data.stop_details && data.stop_details.category
                    ? ' (' + data.stop_details.category + ')' : '') + '.');
            refusal.status = 200;
            refusal.data = data;
            throw refusal;
        }

        // Normalize content[] blocks → OpenAI-shaped choices[]
        var text = (data.content || [])
            .filter(function(b) { return b.type === 'text'; })
            .map(function(b) { return b.text; })
            .join('');

        return {
            choices: [{ message: { role: 'assistant', content: text } }],
            usage: data.usage,
            _raw: data
        };
    },

    _parseJson: async function(resp, label) {
        try {
            return await resp.json();
        } catch (e) {
            var err = new Error('Unexpected response from ' + label + ' (HTTP ' + resp.status + ')');
            err.status = resp.status;
            throw err;
        }
    },

    _throwIfError: function(resp, data, label) {
        if (resp.ok && !(data && data.error)) return;
        var msg = (data && data.error)
            ? ((typeof data.error === 'string') ? data.error : (data.error.message || 'API error'))
            : ('HTTP ' + resp.status);
        var err = new Error(msg);
        err.status = resp.status;
        err.data = data;
        err.provider = label;
        throw err;
    }
};
