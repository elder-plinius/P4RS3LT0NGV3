const baseData = {
    isDarkTheme: true,
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
    showUnicodePanel: false,
    unicodeApplyBusy: false,
    unicodeApplyFlash: false,
    unicodePanelToggleLock: false,
    unicodeApplyFlashTimeout: null,
    showDangerModal: false,
    dangerThresholdTokens: window.CONFIG.DANGER_THRESHOLD_TOKENS,
    showGlitchTokenPanel: false,
    glitchTokensLoaded: false,
    glitchTokenBehavior: '',
    glitchTokenSearch: '',
    filteredGlitchTokens: [],
    allGlitchTokens: [],
    openrouterApiKey: localStorage.getItem('openrouter-api-key') || '',
    showApiKey: false,
    apiKeySaved: false
};

const toolData = (window.toolRegistry && typeof window.toolRegistry.mergeVueData === 'function') 
    ? window.toolRegistry.mergeVueData() 
    : {};
const mergedData = Object.assign({}, baseData, toolData);

const toolMethods = (window.toolRegistry && typeof window.toolRegistry.mergeVueMethods === 'function') 
    ? window.toolRegistry.mergeVueMethods() 
    : {};

window.app = new Vue({
    el: '#app',
    data: mergedData,
    methods: Object.assign({}, toolMethods || {}, {
        toggleUnicodePanel(event) {
            if (this.unicodePanelToggleLock) return;
            this.unicodePanelToggleLock = true;
            
            this.showUnicodePanel = !this.showUnicodePanel;
            const panel = document.getElementById('unicode-options-panel');
            if (panel) {
                if (this.showUnicodePanel) panel.classList.add('active');
                else panel.classList.remove('active');
            }
            
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
        switchToTab(tabName) {
            if (this.activeTab && window.toolRegistry) {
                window.toolRegistry.deactivateTool(this.activeTab, this);
            }
            
            this.activeTab = tabName;
            this.universalDecodeInput = '';
            this.universalDecodeResult = null;
            
            if (window.toolRegistry) {
                window.toolRegistry.activateTool(tabName, this);
            }
        },
        
        toggleTheme() {
            this.isDarkTheme = window.ThemeUtils.toggleTheme(this.isDarkTheme);
        },
        
        toggleCopyHistory() {
            this.showCopyHistory = !this.showCopyHistory;
            
            if (this.showCopyHistory && this.copyHistory.length > 0) {
                this.$nextTick(() => {
                    const firstCopyButton = document.querySelector('.copy-again-button');
                    if (firstCopyButton) {
                        firstCopyButton.focus();
                    }
                });
            }
        },
        
        toggleGlitchTokenPanel(event) {
            this.showGlitchTokenPanel = !this.showGlitchTokenPanel;
            
            // Load tokens if not already loaded
            if (this.showGlitchTokenPanel && !this.glitchTokensLoaded) {
                this.loadGlitchTokens();
            }
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
        
        saveApiKey() {
            var trimmed = (this.openrouterApiKey || '').trim();
            if (trimmed) {
                this.openrouterApiKey = trimmed;
                localStorage.setItem('openrouter-api-key', trimmed);
                this.apiKeySaved = true;
                this.showNotification('API key saved', 'success');
                setTimeout(() => { this.apiKeySaved = false; }, 2000);
            }
        },

        clearApiKey() {
            this.openrouterApiKey = '';
            this.showApiKey = false;
            localStorage.removeItem('openrouter-api-key');
            localStorage.removeItem('openrouter_api_key');
            localStorage.removeItem('plinyos-api-key');
            this.showNotification('API key cleared', 'success');
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
        if (window.ThemeUtils && window.ThemeUtils.initializeTheme) {
            this.isDarkTheme = window.ThemeUtils.initializeTheme();
        if (this.isDarkTheme) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.add('light-theme');
            }
        } else if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
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
        
        this.$nextTick(() => {
            const closeButton = document.querySelector('#unicode-options-panel .close-button');
            if (closeButton) {
                const handleClose = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleUnicodePanel(e);
                };
                
                closeButton.addEventListener('click', handleClose, { passive: false });
                closeButton.addEventListener('touchend', handleClose, { passive: false });
            }
        });
        
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
