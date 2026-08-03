const baseData = {
    activeTheme: 'dark',
    themeOptions: (window.ThemeUtils && window.ThemeUtils.getThemes)
        ? window.ThemeUtils.getThemes()
        : [{ id: 'dark', name: 'Dark' }, { id: 'light', name: 'Light' }],
    activeTab: 'transforms',
    registeredTools: [],
    universalDecodeInput: '',
    universalDecodeResult: null,
    isPasteOperation: false,
    lastCopyTime: 0,
    ignoreKeyboardEvents: false,
    isTransformCopy: false,
    keyboardEventsTimeout: null,
    showDecoder: true,
    tbCarrierManual: '',
    copyHistory: [],
    maxHistoryItems: window.CONFIG.MAX_HISTORY_ITEMS,
    showCopyHistory: false,
    activeUtilityPanel: 'history',
    mobileUtilityOpen: false,
    utilityPanelInteractionGuard: false,
    showUnicodePanel: false,
    unicodeApplyBusy: false,
    unicodeApplyFlash: false,
    unicodePanelToggleLock: false,
    unicodeApplyFlashTimeout: null,
    showDangerModal: false,
    dangerThresholdTokens: window.CONFIG.DANGER_THRESHOLD_TOKENS,
    showGlitchTokenPanel: false,
    showEndSequencePanel: false,
    endSequenceCategories: (typeof window !== 'undefined' && window.END_SEQUENCE_CATEGORIES)
        ? window.END_SEQUENCE_CATEGORIES
        : [],
    glitchTokensLoaded: false,
    glitchTokenBehavior: '',
    glitchTokenSearch: '',
    filteredGlitchTokens: [],
    allGlitchTokens: [],
    openrouterApiKey: localStorage.getItem('openrouter-api-key') || '',
    showApiKey: false,
    apiKeySaved: false,
    aiProviders: window.AIProvider ? window.AIProvider.getAllProviders() : [],
    aiCatalogError: '',
    aiKeyDrafts: {},
    aiRevealedKeys: {},
    aiNewProviderName: '',
    aiNewProviderBaseUrl: '',
    aiNewProviderKey: '',
    aiNewProviderModels: '',
    aiNewProviderKind: 'openai',
    aiProviderFormOpen: false,
    openRouterModels: (window.OpenRouterModels && window.OpenRouterModels.getStaticFallback)
        ? window.OpenRouterModels.getStaticFallback()
        : [],
    openRouterModelsCatalog: (window.OpenRouterModels && window.OpenRouterModels.getStaticFallback)
        ? window.OpenRouterModels.getStaticFallback()
        : [],
    openRouterModelsDisabled: (window.OpenRouterModels && window.OpenRouterModels.loadDisabledIds)
        ? window.OpenRouterModels.loadDisabledIds()
        : [],
    openRouterModelsFilterQuery: '',
    openRouterModelsLoading: false,
    openRouterModelsError: '',
    openRouterModelsKeyInfo: null
};

const toolData = (window.toolRegistry && typeof window.toolRegistry.mergeVueData === 'function') 
    ? window.toolRegistry.mergeVueData() 
    : {};
const mergedData = Object.assign({}, baseData, toolData);

const toolMethods = (window.toolRegistry && typeof window.toolRegistry.mergeVueMethods === 'function') 
    ? window.toolRegistry.mergeVueMethods() 
    : {};

Vue.component('openrouter-model-select', {
    props: {
        value: { type: String, default: '' },
        label: { type: String, default: 'Model' },
        showRefresh: { type: Boolean, default: true }
    },
    computed: {
        models: function() {
            return this.$root.openRouterModels || [];
        },
        loading: function() {
            return this.$root.openRouterModelsLoading;
        },
        error: function() {
            return this.$root.openRouterModelsError;
        },
        keyInfo: function() {
            return this.$root.openRouterModelsKeyInfo;
        },
        hasApiKey: function() {
            return this.$root.getOpenRouterApiKey ? !!this.$root.getOpenRouterApiKey() : false;
        },
        routerHint: function() {
            if (!this.value || !window.OpenRouterModels || !window.OpenRouterModels.getRouterHint) {
                return '';
            }
            return window.OpenRouterModels.getRouterHint(this.value);
        }
    },
    methods: {
        onChange: function(event) {
            this.$emit('input', event.target.value);
        },
        refresh: function() {
            if (this.$root.refreshOpenRouterModels) {
                this.$root.refreshOpenRouterModels(true);
            }
        },
        formatLabel: function(model) {
            return this.$root.formatOpenRouterModelLabel
                ? this.$root.formatOpenRouterModelLabel(model)
                : (model && model.name) || '';
        }
    },
    template:
        '<label class="openrouter-model-picker">' +
            '<span class="openrouter-model-label">{{ label }}</span>' +
            '<div class="openrouter-model-row">' +
                '<select ' +
                    'class="openrouter-model-select" ' +
                    ':value="value" ' +
                    '@change="onChange" ' +
                    ':disabled="loading && !models.length"' +
                '>' +
                    '<option v-if="loading && !models.length" disabled value="">Loading models…</option>' +
                    '<option v-for="m in models" :key="m.id" :value="m.id">{{ formatLabel(m) }}</option>' +
                '</select>' +
                '<button ' +
                    'v-if="showRefresh" ' +
                    'type="button" ' +
                    'class="openrouter-model-refresh" ' +
                    '@click="refresh" ' +
                    ':disabled="loading" ' +
                    'title="Refresh model list from OpenRouter"' +
                    'aria-label="Refresh model list"' +
                '>' +
                    '<i class="fas" :class="loading ? \'fa-spinner fa-spin\' : \'fa-sync-alt\'"></i>' +
                '</button>' +
            '</div>' +
            '<small v-if="error" class="openrouter-model-hint openrouter-model-hint-error">{{ error }}</small>' +
            '<small v-else-if="routerHint" class="openrouter-model-hint openrouter-model-hint-router">{{ routerHint }}</small>' +
            '<small v-else-if="!hasApiKey" class="openrouter-model-hint">Add an OpenRouter key in Settings to load models for your account.</small>' +
            '<small v-else-if="keyInfo && keyInfo.is_free_tier" class="openrouter-model-hint">Free tier account — models marked · free need no credits.</small>' +
            '<small v-else class="openrouter-model-hint">Curate visible models in Settings → AI Models.</small>' +
        '</label>'
});

window.app = new Vue({
    el: '#app',
    data: mergedData,
    computed: {
        filteredOpenRouterModelsCatalog: function() {
            var query = (this.openRouterModelsFilterQuery || '').trim().toLowerCase();
            var catalog = this.openRouterModelsCatalog || [];
            if (!query) return catalog;
            return catalog.filter(function(model) {
                var haystack = [
                    model.id,
                    model.name,
                    model.provider,
                    model.summary
                ].filter(Boolean).join(' ').toLowerCase();
                return haystack.indexOf(query) !== -1;
            });
        }
    },
    methods: Object.assign({}, toolMethods || {}, {
        toggleUnicodePanel(event) {
            if (this.unicodePanelToggleLock) return;
            this.unicodePanelToggleLock = true;
            this.switchUtilityPanel('settings');
            setTimeout(() => {
                this.unicodePanelToggleLock = false;
            }, 300);
        },
        applyUnicodeOptions() {
            if (this.unicodeApplyBusy) return;
            
            if (this.unicodeApplyFlashTimeout) {
                clearTimeout(this.unicodeApplyFlashTimeout);
                this.unicodeApplyFlashTimeout = null;
            }
            
            this.unicodeApplyFlash = false;
            this.unicodeApplyBusy = true;
            
            try {
                const initSel = document.querySelector('.steg-initial-presentation');
                const vs0Sel = document.querySelector('.steg-vs-zero');
                const vs1Sel = document.querySelector('.steg-vs-one');
                const zwSel = document.querySelector('.steg-inter-zw');
                const everyInput = document.querySelector('.steg-inter-every');
                const orderSel = document.querySelector('.steg-bit-order');
                const trailSel = document.querySelector('.steg-trailing-zw');

                const parseEsc = (s) => window.EscapeParser.parseEscapeSequence(s);

                if (window.steganography && window.steganography.setStegOptions) {
                    window.steganography.setStegOptions({
                        initialPresentation: (initSel && initSel.value) || 'none',
                        bitZeroVS: parseEsc(vs0Sel && vs0Sel.value) || '\ufe0e',
                        bitOneVS: parseEsc(vs1Sel && vs1Sel.value) || '\ufe0f',
                        interBitZW: parseEsc(zwSel && zwSel.value) || null,
                        interBitEvery: Math.max(1, Math.min(8, Number((everyInput && everyInput.value) || 1))),
                        bitOrder: (orderSel && orderSel.value) || 'msb',
                        trailingZW: parseEsc(trailSel && trailSel.value) || ''
                    });
                    this.unicodeApplyFlash = true;
                    this.showNotification('Advanced settings applied', 'success', 'fas fa-sliders-h');
                    this.unicodeApplyFlashTimeout = setTimeout(() => {
                        this.unicodeApplyFlash = false;
                        this.unicodeApplyFlashTimeout = null;
                    }, 1200);
                } else {
                    this.showNotification('Engine missing setStegOptions()', 'warning', 'fas fa-exclamation-triangle');
                }
            } catch (e) {
                console.error('Apply Unicode options error', e);
                this.showNotification('Failed to apply settings', 'error', 'fas fa-exclamation-triangle');
                this.unicodeApplyFlash = false;
            } finally { 
                this.unicodeApplyBusy = false; 
            }
        },
        focusWithoutScroll(el) {
            window.FocusUtils.focusWithoutScroll(el);
        },

        triggerRandomizerChaos() {
            try {
                const section = document.getElementById('category-randomizer');
                const overlay = section && section.querySelector('.chaos-overlay');
                if (!overlay) return;
                const emojis = ['✨','🌀','💥','⚡','🔥','🌈','🎲','🔮','💫','🌪️'];
                for (let i=0;i<10;i++) {
                    const el = document.createElement('div');
                    el.className = 'chaos-particle';
                    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
                    el.style.left = (10 + Math.random()*80) + '%';
                    el.style.fontSize = (14 + Math.random()*10) + 'px';
                    el.style.animationDelay = (Math.random()*0.2) + 's';
                    overlay.appendChild(el);
                    setTimeout(()=>{ if (el.parentNode) el.parentNode.removeChild(el); }, 1300);
                }
                section.classList.add('shake-once','randomizer-glow');
                setTimeout(()=>section && section.classList.remove('shake-once','randomizer-glow'), 600);
            } catch(_) {}
        },
        getValidToolIds() {
            if (window.toolRegistry && typeof window.toolRegistry.getAll === 'function') {
                return window.toolRegistry.getAll().map(function(tool) { return tool.id; });
            }
            return [];
        },

        getRouteSubState(tabName) {
            if (tabName === 'codes' && this.codesMode === 'decode') {
                return 'decode';
            }
            return '';
        },

        applyRouteSubState(route) {
            if (!route || !route.sub) {
                return;
            }

            if (route.tab === 'codes' && (route.sub === 'generate' || route.sub === 'decode')) {
                this.codesMode = route.sub;
            }
        },

        applyRouteFromHash() {
            if (!window.TabRouting) {
                return;
            }

            var route = window.TabRouting.parse();
            var validIds = this.getValidToolIds();
            var defaultTab = 'transforms';

            if (!route || !route.tab) {
                return;
            }

            if (!validIds.includes(route.tab)) {
                this.switchToTab(defaultTab, { fromRoute: true, updateUrl: true, replaceUrl: true });
                return;
            }

            if (route.tab !== this.activeTab) {
                this.switchToTab(route.tab, { fromRoute: true, updateUrl: false, route: route });
                return;
            }

            this.applyRouteSubState(route);
        },

        switchToTab(tabName, options) {
            options = options || {};

            if (this.activeTab && window.toolRegistry) {
                window.toolRegistry.deactivateTool(this.activeTab, this);
            }
            
            this.activeTab = tabName;
            this.universalDecodeInput = '';
            this.universalDecodeResult = null;
            
            if (window.toolRegistry) {
                window.toolRegistry.activateTool(tabName, this);
            }

            if (options.fromRoute && options.route) {
                this.applyRouteSubState(options.route);
            }

            if (options.updateUrl !== false && !options.fromRoute && window.TabRouting) {
                window.TabRouting.setHash(tabName, this.getRouteSubState(tabName), !!options.replaceUrl);
            }
        },
        
        setTheme(themeId) {
            if (!window.ThemeUtils) return;
            this.activeTheme = window.ThemeUtils.applyTheme(themeId);
        },

        cycleTheme() {
            if (!window.ThemeUtils) return;
            this.activeTheme = window.ThemeUtils.cycleTheme(this.activeTheme);
        },
        
        toggleCopyHistory() {
            this.switchUtilityPanel('history');
        },

        toggleGlitchTokenPanel() {
            this.switchUtilityPanel('glitch');
        },

        toggleEndSequencePanel() {
            this.switchUtilityPanel('endsequences');
        },

        markUtilityPanelInteraction() {
            this.utilityPanelInteractionGuard = true;
            var self = this;
            setTimeout(function() {
                self.utilityPanelInteractionGuard = false;
            }, 400);
        },

        switchUtilityPanel(panelId) {
            var isMobile = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;

            this.activeUtilityPanel = panelId;
            this.showCopyHistory = panelId === 'history';
            this.showGlitchTokenPanel = panelId === 'glitch';
            this.showEndSequencePanel = panelId === 'endsequences';
            this.showUnicodePanel = panelId === 'settings';

            if (isMobile) {
                this.mobileUtilityOpen = true;
                this.markUtilityPanelInteraction();
            }

            if (panelId === 'glitch' && !this.glitchTokensLoaded) {
                this.loadGlitchTokens();
            }

            if (panelId === 'history' && this.copyHistory.length > 0) {
                this.$nextTick(function() {
                    var firstCopyButton = document.querySelector('.copy-again-button');
                    if (firstCopyButton) {
                        firstCopyButton.focus();
                    }
                });
            }
        },

        closeMobileUtility() {
            if (this.utilityPanelInteractionGuard) {
                return;
            }
            this.mobileUtilityOpen = false;
        },

        openMobileUtility() {
            this.mobileUtilityOpen = true;
            this.markUtilityPanelInteraction();
        },

        copyEndSequence(value) {
            if (!value) return;
            this.copyToClipboard(value);
            this.showNotification('Copied', 'success', 'fas fa-copy');
        },
        
        async loadGlitchTokens() {
            if (this.glitchTokensLoaded) return;
            
            try {
                if (window.loadGlitchTokens) {
                    await window.loadGlitchTokens();
                }
                
                if (window.getAllGlitchTokens) {
                    this.allGlitchTokens = window.getAllGlitchTokens();
                    this.filteredGlitchTokens = this.allGlitchTokens;
                    this.glitchTokensLoaded = true;
                }
            } catch (error) {
                console.error('Error loading glitch tokens:', error);
                this.showNotification('Failed to load glitch tokens', 'error', 'fas fa-exclamation-triangle');
            }
        },
        
        filterGlitchTokens() {
            let filtered = this.allGlitchTokens;
            
            // Filter by behavior
            if (this.glitchTokenBehavior) {
                filtered = filtered.filter(token => token.behavior === this.glitchTokenBehavior);
            }
            
            // Filter by search
            if (this.glitchTokenSearch) {
                const searchLower = this.glitchTokenSearch.toLowerCase();
                filtered = filtered.filter(token => {
                    const tokenText = (token.token || '').toLowerCase();
                    const origin = (token.origin || '').toLowerCase();
                    const observedOutput = (token.observed_output || '').toLowerCase();
                    const tokenId = String(token.token_id || '');
                    
                    return tokenText.includes(searchLower) ||
                           origin.includes(searchLower) ||
                           observedOutput.includes(searchLower) ||
                           tokenId.includes(searchLower);
                });
            }
            
            this.filteredGlitchTokens = filtered;
        },
        
        copyGlitchToken(tokenText) {
            if (!tokenText) return;
            
            this.copyToClipboard(tokenText);
            this.showNotification('Glitch token copied!', 'success', 'fas fa-copy');
        },

        addToCopyHistory(source, content) {
            window.HistoryUtils.addToHistory(
                this.copyHistory,
                this.maxHistoryItems,
                source,
                content
            );
        },
        
        clearCopyHistory() {
            window.HistoryUtils.clearHistory(this.copyHistory);
            this.showNotification('History cleared', 'success', 'fas fa-check');
        },
        
        removeFromCopyHistory(id) {
            window.HistoryUtils.removeFromHistory(this.copyHistory, id);
            this.showNotification('Removed from history', 'success', 'fas fa-check');
        },
        
        formatHistoryTime(timestamp) {
            if (!timestamp) return '';
            const date = new Date(timestamp);
            return date.toLocaleString();
        },
        
        async copyToClipboard(text, skipHistory = false) {
            if (!text || !window.ClipboardUtils) return;
            
            // Check if content already exists in history
            const alreadyInHistory = this.copyHistory.some(item => item.content === text);
            
            const source = window.HistoryUtils.getHistorySource(this.activeTab, {
                activeTransform: this.activeTransform,
                activeSteg: this.activeSteg,
                selectedEmoji: this.selectedEmoji
            });
            
            const success = await window.ClipboardUtils.copy(text, {
                onSuccess: () => {
                    // Only add to history if not skipping and not already in history
                    if (!skipHistory && !alreadyInHistory) {
                        this.addToCopyHistory(source, text);
                    }
                    window.FocusUtils.clearFocusAndSelection();
                }
            });
            
            return success;
        },
        
        forceCopyToClipboard(text) {
            if (!text || !window.ClipboardUtils) return;
            
            if (this.isPasteOperation) {
                this.isPasteOperation = false;
                return;
            }
            
            if (!this.isTransformCopy && this.ignoreKeyboardEvents) {
                return;
            }
            
            const source = window.HistoryUtils.getHistorySource(this.activeTab, {
                activeTransform: this.activeTransform,
                activeSteg: this.activeSteg,
                selectedEmoji: this.selectedEmoji
            });
            
            window.ClipboardUtils.copy(text, {
                onSuccess: () => {
                    this.addToCopyHistory(source, text);
                    if (this.isTransformCopy) {
                        this.showCopiedPopup();
                        this.ignoreKeyboardEvents = true;
                        clearTimeout(this.keyboardEventsTimeout);
                        this.keyboardEventsTimeout = setTimeout(() => {
                            this.ignoreKeyboardEvents = false;
                        }, window.CONFIG.KEYBOARD_EVENTS_TIMEOUT_MS);
                    }
                    this.isTransformCopy = false;
                    const inputBox = document.querySelector('#transform-input');
                    if (inputBox) {
                        window.FocusUtils.focusWithoutScroll(inputBox);
                        const len = inputBox.value.length;
                        try { inputBox.setSelectionRange(len, len); } catch (_) {}
                    }
                }
            });
        },
        
        showNotification(message, type = 'success', iconClass = null) {
            window.NotificationUtils.showNotification(message, type, iconClass);
        },
        
        showCopiedPopup() {
            window.NotificationUtils.showCopiedPopup();
        },

        getOpenRouterApiKey() {
            var key = (this.openrouterApiKey || '').trim();
            if (key) return key;
            if (window.OpenRouterModels && window.OpenRouterModels.getApiKey) {
                return window.OpenRouterModels.getApiKey();
            }
            return '';
        },

        formatOpenRouterModelLabel(model) {
            if (!model) return '';
            // Cross-provider dropdown: prefix with the provider so identically
            // named models from different providers stay distinguishable.
            var base = (window.OpenRouterModels && window.OpenRouterModels.formatLabel)
                ? window.OpenRouterModels.formatLabel(model)
                : (model.name || model.modelId || '');
            return model.providerName ? model.providerName + ' · ' + base : base;
        },

        isOpenRouterModelEnabled(modelId) {
            if (!window.OpenRouterModels) return true;
            return window.OpenRouterModels.isModelEnabled(modelId, this.openRouterModelsDisabled);
        },

        rebuildOpenRouterDropdown() {
            if (!window.OpenRouterModels) return;
            // Curation (enable/disable) is an OpenRouter-catalog concept, so it
            // only filters the OpenRouter rows; other providers' models always
            // show. Everything is merged into one cross-provider dropdown.
            var pinned = window.OpenRouterModels.getPinnedModelIds(this);
            var curatedOR = window.OpenRouterModels.filterForDropdown(
                this.openRouterModelsCatalog,
                this.openRouterModelsDisabled,
                pinned.map(function(id) {
                    return window.AIProvider.parseModelId(id).modelId;
                })
            );
            this.openRouterModels = window.AIProvider.getAllModels(curatedOR);
        },

        toggleOpenRouterModelEnabled(modelId) {
            if (!modelId) return;
            var disabled = this.openRouterModelsDisabled.slice();
            var index = disabled.indexOf(modelId);
            if (index === -1) {
                disabled.push(modelId);
            } else {
                disabled.splice(index, 1);
            }
            this.openRouterModelsDisabled = disabled;
            if (window.OpenRouterModels) {
                window.OpenRouterModels.saveDisabledIds(disabled);
            }
            this.rebuildOpenRouterDropdown();
            this.syncOpenRouterModelSelections();
        },

        enableAllOpenRouterModels() {
            this.openRouterModelsDisabled = [];
            if (window.OpenRouterModels) {
                window.OpenRouterModels.saveDisabledIds([]);
            }
            this.rebuildOpenRouterDropdown();
            this.syncOpenRouterModelSelections();
        },

        showFreeOpenRouterModelsOnly() {
            var disabled = (this.openRouterModelsCatalog || [])
                .filter(function(model) {
                    return model && model.id && !model.free && !model.virtual;
                })
                .map(function(model) { return model.id; });
            this.openRouterModelsDisabled = disabled;
            if (window.OpenRouterModels) {
                window.OpenRouterModels.saveDisabledIds(disabled);
            }
            this.rebuildOpenRouterDropdown();
            this.syncOpenRouterModelSelections();
        },

        syncOpenRouterModelSelections() {
            if (!window.OpenRouterModels || !this.openRouterModels.length) return;
            var models = this.openRouterModels;
            var ensure = window.OpenRouterModels.ensureValidSelection.bind(window.OpenRouterModels);
            // Saved preferences predate qualified ids; a bare id means OpenRouter.
            var qualify = function(id) {
                if (!id) return id;
                return id.indexOf(window.AIProvider.SEP) === -1
                    ? window.AIProvider.qualify('openrouter', id)
                    : id;
            };
            var pick = function(current, stored, fallback) {
                return ensure(qualify(current), models, qualify(stored || fallback));
            };

            if (typeof this.pcModel !== 'undefined') {
                this.pcModel = pick(this.pcModel, localStorage.getItem('pc-model'), 'openrouter/auto');
            }
            if (typeof this.acModel !== 'undefined') {
                this.acModel = pick(this.acModel, localStorage.getItem('ac-model'), 'openrouter/auto');
            }
            if (typeof this.saModel !== 'undefined') {
                this.saModel = pick(this.saModel, localStorage.getItem('sa-model'), 'openrouter/free');
            }
            if (typeof this.translateModel !== 'undefined') {
                this.translateModel = pick(this.translateModel, localStorage.getItem('translate-model'), 'google/gemma-3-27b-it');
            }
        },

        // Pull live model lists from every configured provider that exposes a
        // /models endpoint. A failure is non-fatal — that provider just falls
        // back to its built-in list, so one bad key can't empty the dropdown.
        refreshProviderCatalogs: async function(force) {
            var providers = window.AIProvider.getConfiguredProviders()
                .filter(function(p) { return p.id !== 'openrouter'; });
            if (!providers.length) {
                this.aiCatalogError = '';
                return;
            }
            var failures = [];
            await Promise.all(providers.map(async function(p) {
                try {
                    await window.AIProvider.fetchModels(p.id, { force: !!force });
                } catch (e) {
                    failures.push(p.name + (e && e.status === 401 ? ' (invalid key)' : ''));
                    console.warn('Model list fetch failed for ' + p.name + ':', e);
                }
            }));
            // Wording stays accurate whether the provider falls back to its
            // built-in list or keeps a previously fetched one.
            this.aiCatalogError = failures.length
                ? 'Could not refresh models from: ' + failures.join(', ')
                : '';
        },

        refreshOpenRouterModels: async function(force) {
            if (!window.OpenRouterModels) return;
            if (this.openRouterModelsLoading) return;

            // Other providers' catalogs first, so the dropdown rebuild below
            // picks them up in the same pass.
            await this.refreshProviderCatalogs(force);

            // OpenRouter has its own catalog path (curation + key info); skip
            // it entirely when no OpenRouter key is configured.
            if (!window.AIProvider.hasApiKey('openrouter')) {
                this.openRouterModelsError = '';
                this.openRouterModelsKeyInfo = null;
                this.rebuildOpenRouterDropdown();
                this.syncOpenRouterModelSelections();
                return;
            }

            this.openRouterModelsLoading = true;
            this.openRouterModelsError = '';

            var apiKey = this.getOpenRouterApiKey();

            try {
                var models = await window.OpenRouterModels.fetch(apiKey, { force: !!force });
                this.openRouterModelsCatalog = models;
                this.rebuildOpenRouterDropdown();
                this.syncOpenRouterModelSelections();

                if (apiKey) {
                    this.openRouterModelsKeyInfo = await window.OpenRouterModels.fetchKeyInfo(apiKey);
                } else {
                    this.openRouterModelsKeyInfo = null;
                }
            } catch (err) {
                console.warn('OpenRouter model fetch failed:', err);
                var fallback = window.OpenRouterModels.getStaticFallback();
                this.openRouterModelsCatalog = window.OpenRouterModels.mergeWithVirtual(fallback);
                this.rebuildOpenRouterDropdown();
                this.syncOpenRouterModelSelections();

                if (err && err.status === 401) {
                    this.openRouterModelsError = 'Invalid API key — check Settings.';
                } else {
                    this.openRouterModelsError = (err && err.message) || 'Could not load models; using offline list.';
                }
            } finally {
                this.openRouterModelsLoading = false;
            }
        },
        
        refreshAiProviders() {
            this.aiProviders = window.AIProvider.getAllProviders();
            var drafts = {};
            var revealed = {};
            this.aiProviders.forEach((p) => {
                drafts[p.id] = window.AIProvider.getApiKey(p.id);
                revealed[p.id] = !!this.aiRevealedKeys[p.id];
            });
            this.aiKeyDrafts = drafts;
            this.aiRevealedKeys = revealed;
        },

        aiProviderConfigured(id) {
            return !!(this.aiKeyDrafts[id] || '').trim();
        },

        aiProviderModelCount(id) {
            if (id === 'openrouter') return this.openRouterModelsCatalog.length;
            var p = window.AIProvider.getProvider(id);
            return p ? window.AIProvider.modelsFor(p).length : 0;
        },

        toggleAiKeyVisible(id) {
            this.$set(this.aiRevealedKeys, id, !this.aiRevealedKeys[id]);
        },

        saveAiProviderKey(id) {
            var key = (this.aiKeyDrafts[id] || '').trim();
            if (!key) return;
            window.AIProvider.setApiKey(id, key);
            if (id === 'openrouter') {
                this.openrouterApiKey = key;
            }
            this.refreshAiProviders();
            this.apiKeySaved = true;
            this.showNotification(window.AIProvider.getLabel(id) + ' key saved', 'success');
            setTimeout(() => { this.apiKeySaved = false; }, 2000);
            this.refreshOpenRouterModels(true);
        },

        clearAiProviderKey(id) {
            window.AIProvider.clearApiKey(id);
            if (id === 'openrouter') {
                this.openrouterApiKey = '';
                this.openRouterModelsKeyInfo = null;
            }
            this.refreshAiProviders();
            this.showNotification(window.AIProvider.getLabel(id) + ' key cleared', 'success');
            this.refreshOpenRouterModels(true);
        },

        addAiCustomProvider() {
            var name = (this.aiNewProviderName || '').trim();
            var baseUrl = (this.aiNewProviderBaseUrl || '').trim();
            if (!name || !baseUrl) {
                this.showNotification('Name and base URL are required', 'error');
                return;
            }
            window.AIProvider.addCustomProvider({
                name: name,
                baseUrl: baseUrl,
                kind: this.aiNewProviderKind,
                apiKey: this.aiNewProviderKey,
                models: this.aiNewProviderModels
            });
            this.aiNewProviderName = '';
            this.aiNewProviderBaseUrl = '';
            this.aiNewProviderKey = '';
            this.aiNewProviderModels = '';
            this.aiNewProviderKind = 'openai';
            this.aiProviderFormOpen = false;
            this.refreshAiProviders();
            this.showNotification('Provider added', 'success');
            this.refreshOpenRouterModels(false);
        },

        removeAiCustomProvider(id) {
            if (!window.confirm('Remove provider "' + window.AIProvider.getLabel(id) + '"?')) return;
            window.AIProvider.removeCustomProvider(id);
            this.refreshAiProviders();
            this.showNotification('Provider removed', 'success');
            this.refreshOpenRouterModels(false);
        },

        setupPasteHandlers() {
            const textareas = document.querySelectorAll('textarea');
            textareas.forEach(textarea => {
                textarea.addEventListener('paste', (e) => {
                    this.isPasteOperation = true;
                    setTimeout(() => {
                        this.isPasteOperation = false;
                    }, window.CONFIG.PASTE_FLAG_RESET_DELAY_MS);
                });
            });
        }
    }),
    mounted() {
        if (window.ThemeUtils) {
            this.activeTheme = window.ThemeUtils.applyTheme(window.ThemeUtils.initializeTheme());
            this._themeKeyHandler = (event) => {
                if (event.defaultPrevented || event.repeat) return;
                if (event.key !== 'd' && event.key !== 'D') return;
                var tag = event.target && event.target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (event.target && event.target.isContentEditable)) {
                    return;
                }
                event.preventDefault();
                this.cycleTheme();
            };
            document.addEventListener('keydown', this._themeKeyHandler);
        }
        
        if (window.toolRegistry && typeof window.toolRegistry.mergeVueLifecycle === 'function') {
            const lifecycleHooks = window.toolRegistry.mergeVueLifecycle();
            if (lifecycleHooks && lifecycleHooks.mounted) {
                lifecycleHooks.mounted.call(this);
            }
        }
        
        if (window.toolRegistry && typeof window.toolRegistry.getAll === 'function') {
            this.registeredTools = window.toolRegistry.getAll();
        }

        this.refreshAiProviders();
        this.refreshOpenRouterModels(false);

        var initialRoute = window.TabRouting && window.TabRouting.parse();
        if (initialRoute && initialRoute.tab && this.getValidToolIds().includes(initialRoute.tab)) {
            this.applyRouteFromHash();
        } else if (window.toolRegistry) {
            window.toolRegistry.activateTool(this.activeTab, this);
        }

        this._onHashChange = () => {
            if (window.TabRouting && window.TabRouting.shouldIgnoreHashChange()) {
                return;
            }
            this.applyRouteFromHash();
        };
        window.addEventListener('hashchange', this._onHashChange);
        
        document.addEventListener('click', (e) => {
            if (e.target.closest('.custom-tooltip')) {
                return;
            }
            
            const tooltipIcon = e.target.closest('.tooltip-icon');
            
            if (tooltipIcon) {
                e.preventDefault();
                e.stopPropagation();
                
                const tooltipText = tooltipIcon.getAttribute('data-tooltip');
                if (!tooltipText) return;
                
                const existingTooltip = document.querySelector('.custom-tooltip.active');
                if (existingTooltip && existingTooltip.textContent === tooltipText) {
                    existingTooltip.classList.remove('active');
                    setTimeout(() => {
                        if (!existingTooltip.classList.contains('active')) {
                            existingTooltip.remove();
                        }
                    }, 200);
                    return;
                }
                
                document.querySelectorAll('.custom-tooltip.active').forEach(tooltip => {
                    tooltip.classList.remove('active');
                    setTimeout(() => {
                        if (!tooltip.classList.contains('active')) {
                            tooltip.remove();
                        }
                    }, 200);
                });
                
                setTimeout(() => {
                    const tooltip = document.createElement('div');
                    tooltip.className = 'custom-tooltip active';
                    tooltip.textContent = tooltipText;
                    
                    document.body.appendChild(tooltip);
                    
                    const rect = tooltipIcon.getBoundingClientRect();
                    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                    tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
                    tooltip.style.transform = 'translateX(-50%)';
                }, 10);
                
                return;
            }
            
            if (e.target.closest('#unicode-options-panel')) {
                return;
            }
            
            document.querySelectorAll('.custom-tooltip.active').forEach(tooltip => {
                tooltip.classList.remove('active');
                setTimeout(() => {
                    if (!tooltip.classList.contains('active')) {
                        tooltip.remove();
                    }
                }, 200);
            });
        });
        
        this.$nextTick(() => {
            const initializeEmojiGrid = () => {
                if (this.activeTab !== 'steganography') {
                    return;
                }
                
                const emojiGridContainer = document.getElementById('emoji-grid-container');
                
                if (emojiGridContainer) {
                    emojiGridContainer.setAttribute('style', 'display: block !important; visibility: visible !important; min-height: 300px; padding: 10px;');
                    
                    const emojiLibrary = document.querySelector('.emoji-library');
                    if (emojiLibrary) {
                        emojiLibrary.setAttribute('style', 'display: block !important; visibility: visible !important; margin-top: 20px; overflow: visible;');
                    }
                    
                    this.renderEmojiGrid();
                    clearInterval(emojiGridInitializer);
                }
            };
            
            const emojiGridInitializer = setInterval(initializeEmojiGrid, window.CONFIG.EMOJI_GRID_INIT_INTERVAL_MS);
            this._emojiGridInitializer = emojiGridInitializer;
            this.setupPasteHandlers();
        });
    },
    
    created() {
        if (window.toolRegistry && typeof window.toolRegistry.mergeVueLifecycle === 'function') {
            const lifecycleHooks = window.toolRegistry.mergeVueLifecycle();
            if (lifecycleHooks && lifecycleHooks.created) {
                lifecycleHooks.created.call(this);
            }
        }
    },
    
    beforeDestroy() {
        if (this._themeKeyHandler) {
            document.removeEventListener('keydown', this._themeKeyHandler);
            this._themeKeyHandler = null;
        }

        if (this._onHashChange) {
            window.removeEventListener('hashchange', this._onHashChange);
            this._onHashChange = null;
        }

        if (this._emojiGridInitializer) {
            clearInterval(this._emojiGridInitializer);
            this._emojiGridInitializer = null;
        }
        
        if (window.toolRegistry && typeof window.toolRegistry.mergeVueLifecycle === 'function') {
            const lifecycleHooks = window.toolRegistry.mergeVueLifecycle();
            if (lifecycleHooks && lifecycleHooks.beforeDestroy) {
                lifecycleHooks.beforeDestroy.call(this);
            }
        }
    },
    
    watch: (window.toolRegistry && typeof window.toolRegistry.mergeVueWatchers === 'function') 
        ? window.toolRegistry.mergeVueWatchers() 
        : {}
});
