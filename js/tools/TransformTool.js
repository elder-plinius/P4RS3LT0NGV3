/**
 * Transform Tool - Text transformation tool
 */
class TransformTool extends Tool {
    constructor() {
        super({
            id: 'transforms',
            name: 'Transform',
            icon: 'fa-font',
            title: 'Transform text (T)',
            order: 1
        });
    }
    
    getVueData() {
        const transforms = (window.transforms && Object.keys(window.transforms).length > 0)
            ? Object.entries(window.transforms)
                .filter(([key, transform]) => {
                    // Filter out transforms that don't have required properties
                    if (!transform || !transform.name || !transform.func) {
                        console.warn(`Transform "${key}" is missing required properties (name or func)`, transform);
                        return false;
                    }
                    return true;
                })
                .map(([key, transform]) => ({
                    name: transform.name,
                    func: transform.func.bind(transform),
                    preview: transform.preview ? transform.preview.bind(transform) : function() { return '[preview]'; },
                    reverse: transform.reverse ? transform.reverse.bind(transform) : null,
                    category: transform.category || 'special',
                    configurableOptions: transform.configurableOptions || [],
                    hasConfigurableOptions: Array.isArray(transform.configurableOptions) && transform.configurableOptions.length > 0,
                    inputKind: transform.inputKind === 'text' ? 'text' : 'textarea'
                }))
            : [];
        
        const categorySet = new Set();
        transforms.forEach(transform => {
            if (transform.category) {
                categorySet.add(transform.category);
            }
        });
        
        // Legend categories: always alphabetical (for quick link buttons)
        const allCategories = Array.from(categorySet);
        const categoriesWithoutRandomizer = allCategories.filter(c => c !== 'randomizer');
        const legendCategories = [...categoriesWithoutRandomizer.sort((a, b) => a.localeCompare(b)), 'randomizer'];
        
        // Section categories: can be reordered (load saved order or use alphabetical)
        const savedOrder = this.loadCategoryOrder();
        const sectionCategories = savedOrder && savedOrder.length > 0
            ? this.mergeCategoryOrder(allCategories, savedOrder)
            : [...legendCategories]; // Create a copy so legendCategories remains immutable
        
        // Load last used transforms
        const lastUsed = this.loadLastUsed();
        
        // Load favorites
        const favorites = this.loadFavorites();
        
        return {
            transformInput: 'Hello World',
            transformOutput: '',
            activeTransform: null,
            transforms: transforms,
            legendCategories: legendCategories, // Always alphabetical for legend
            categories: sectionCategories, // Custom order for sections
            lastUsedTransforms: lastUsed,
            showLastUsed: lastUsed.length > 0,
            favorites: favorites,
            showFavorites: favorites.length > 0,
            transformOptionPrefs: this.loadTransformOptionPrefs(),
            transformOptionsModalOpen: false,
            transformOptionsModalTransform: null,
            transformOptionsDraft: {}
        };
    }
    
    loadTransformOptionPrefs() {
        try {
            const raw = localStorage.getItem('transformOptionPrefs');
            if (raw) {
                const d = JSON.parse(raw);
                if (d && typeof d === 'object' && !Array.isArray(d)) {
                    return d;
                }
            }
        } catch (e) {
            console.warn('Failed to load transform option prefs:', e);
        }
        return {};
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
    
    loadLastUsed() {
        try {
            const saved = localStorage.getItem('transformLastUsed');
            if (saved) {
                const data = JSON.parse(saved);
                if (!Array.isArray(data)) return [];
                return data
                    .filter(item => {
                        if (item && item.kind === 'translate') {
                            return typeof item.lang === 'string' && item.lang.length > 0;
                        }
                        if (item && item.name && window.transforms) {
                            return Object.values(window.transforms).some(t => t.name === item.name);
                        }
                        return false;
                    })
                    .slice(0, 5);
            }
        } catch (e) {
            console.warn('Failed to load last used transforms:', e);
        }
        return [];
    }
    
    saveLastUsed(transformName) {
        try {
            let lastUsed = this.loadLastUsed();
            
            // Remove if already exists
            lastUsed = lastUsed.filter(item => item.name !== transformName);
            
            // Add to front with timestamp
            lastUsed.unshift({
                name: transformName,
                timestamp: Date.now()
            });
            
            // Keep only last 10
            lastUsed = lastUsed.slice(0, 10);
            
            localStorage.setItem('transformLastUsed', JSON.stringify(lastUsed));
        } catch (e) {
            console.warn('Failed to save last used transform:', e);
        }
    }
    
    loadFavorites() {
        try {
            const saved = localStorage.getItem('transformFavorites');
            if (saved) {
                const data = JSON.parse(saved);
                if (!Array.isArray(data)) return [];
                if (!window.transforms) return [];
                return data.filter(entry => {
                    if (typeof entry === 'string') {
                        return Object.values(window.transforms).some(t => t.name === entry);
                    }
                    if (entry && entry.kind === 'translate' && typeof entry.lang === 'string') {
                        return entry.lang.length > 0;
                    }
                    return false;
                });
            }
        } catch (e) {
            console.warn('Failed to load favorites:', e);
        }
        return [];
    }
    
    saveFavorites(favorites) {
        try {
            localStorage.setItem('transformFavorites', JSON.stringify(favorites));
        } catch (e) {
            console.warn('Failed to save favorites:', e);
        }
    }
    
    getVueMethods() {
        return {
            getDisplayCategory: function(transformName) {
                // Find transform by name and return its category property
                const transform = this.transforms.find(t => t.name === transformName);
                return transform ? transform.category : 'special';
            },
            /**
             * True if this transform should show the options gear (uses saved prefs + defaults in decoder).
             * Falls back to window.transforms when the Vue copy omits configurableOptions.
             */
            transformHasOptionsUI: function(transform) {
                if (!transform || !transform.name) {
                    return false;
                }
                const list = transform.configurableOptions;
                if (Array.isArray(list) && list.length > 0) {
                    return true;
                }
                if (window.transforms) {
                    const full = Object.values(window.transforms).find(function(t) {
                        return t && t.name === transform.name;
                    });
                    return !!(full && full.configurableOptions && full.configurableOptions.length);
                }
                return false;
            },
            getMergedOptionsForTransform: function(transformName) {
                if (typeof window.getMergedTransformOptionsForName === 'function') {
                    return window.getMergedTransformOptionsForName(transformName, this.transforms);
                }
                return {};
            },
            transformInputControlKind: function() {
                if (!this.activeTransform || this.activeTransform.inputKind !== 'text') {
                    return 'textarea';
                }
                return 'text';
            },
            openTransformOptions: function(transform, event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                if (!transform || !this.transformHasOptionsUI(transform)) {
                    return;
                }
                let modalTransform = transform;
                if (!modalTransform.configurableOptions || !modalTransform.configurableOptions.length) {
                    const full = window.transforms && Object.values(window.transforms).find(function(tr) {
                        return tr && tr.name === transform.name;
                    });
                    if (full && full.configurableOptions && full.configurableOptions.length) {
                        modalTransform = Object.assign({}, transform, {
                            configurableOptions: full.configurableOptions
                        });
                    }
                }
                this.transformOptionsModalTransform = modalTransform;
                this.transformOptionsDraft = Object.assign({}, this.getMergedOptionsForTransform(transform.name));
                this.transformOptionsModalOpen = true;
            },
            closeTransformOptions: function() {
                this.transformOptionsModalOpen = false;
                this.transformOptionsModalTransform = null;
                this.transformOptionsDraft = {};
            },
            setTransformOptionDraft: function(id, value) {
                this.$set(this.transformOptionsDraft, id, value);
            },
            resetTransformOptionsToDefaults: function() {
                const t = this.transformOptionsModalTransform;
                if (!t || !t.configurableOptions) {
                    return;
                }
                t.configurableOptions.forEach(opt => {
                    let v = opt.default;
                    if (v === undefined || v === null) {
                        if (opt.type === 'boolean') {
                            v = false;
                        } else if (opt.type === 'select' && opt.options && opt.options.length) {
                            v = opt.options[0].value;
                        } else if (opt.type === 'number') {
                            v = 0;
                        } else {
                            v = '';
                        }
                    }
                    this.$set(this.transformOptionsDraft, opt.id, v);
                });
            },
            commitTransformOptions: function() {
                if (!this.transformOptionsModalTransform) {
                    return;
                }
                const name = this.transformOptionsModalTransform.name;
                this.$set(this.transformOptionPrefs, name, Object.assign({}, this.transformOptionsDraft));
                try {
                    localStorage.setItem('transformOptionPrefs', JSON.stringify(this.transformOptionPrefs));
                } catch (e) {
                    console.warn('Failed to save transform option prefs:', e);
                }
                this.showNotification('Options saved', 'success', 'fas fa-gear');
                this.closeTransformOptions();
                if (this.activeTransform && this.activeTransform.name === name && this.transformInput) {
                    const opts = this.getMergedOptionsForTransform(name);
                    this.transformOutput = this.activeTransform.func(this.transformInput, opts);
                }
            },
            getTransformsByCategory: function(category) {
                const list = this.transforms.filter(transform => transform.category === category);
                if (!this.favorites || this.favorites.length === 0) return list;
                return list.filter(t =>
                    !this.favorites.some(f => typeof f === 'string' && f === t.name)
                );
            },
            isSpecialCategory: function(category) {
                return category === 'randomizer';
            },
            applyTransform: function(transform, event) {
                event && event.preventDefault();
                event && event.stopPropagation();
                
                if (transform && transform.name === 'Random Mix') {
                    this.triggerRandomizerChaos();
                }
                
                if (this.transformInput) {
                    this.activeTransform = transform;
                    
                    // Track last used
                    this.saveLastUsedTransform(transform.name);
                    
                    if (transform.name === 'Random Mix') {
                        this.transformOutput = window.transforms.randomizer.func(this.transformInput);
                        const transformInfo = window.transforms.randomizer.getLastTransformInfo();
                        if (transformInfo.length > 0) {
                            const transformsList = transformInfo.map(t => t.transformName).join(', ');
                            this.showNotification(`Mixed with: ${transformsList}`, 'success', 'fas fa-random');
                        }
                    } else {
                        const opts = this.getMergedOptionsForTransform(transform.name);
                        this.transformOutput = transform.func(this.transformInput, opts);
                    }
                    
                    this.isTransformCopy = true;
                    this.forceCopyToClipboard(this.transformOutput);
                    
                    if (transform.name !== 'Random Mix') {
                        this.showNotification(`${transform.name} applied and copied!`, 'success', 'fas fa-check');
                    }
                    
                    document.querySelectorAll('.transform-button').forEach(button => {
                        button.classList.remove('active');
                    });
                    
                    const inputBox = document.querySelector('#transform-input');
                    if (inputBox) {
                        this.focusWithoutScroll(inputBox);
                        const len = inputBox.value.length;
                        try { inputBox.setSelectionRange(len, len); } catch (_) {}
                    }
                    
                    this.isTransformCopy = false;
                    this.ignoreKeyboardEvents = false;
                }
            },
            saveLastUsedTransform: function(transformName) {
                try {
                    let lastUsed = this.lastUsedTransforms || [];
                    lastUsed = lastUsed.filter(item => {
                        if (item.kind === 'translate') return true;
                        return item.name !== transformName;
                    });
                    lastUsed.unshift({
                        name: transformName,
                        timestamp: Date.now()
                    });
                    lastUsed = lastUsed.slice(0, 5);
                    this.lastUsedTransforms = lastUsed;
                    this.showLastUsed = lastUsed.length > 0;
                    localStorage.setItem('transformLastUsed', JSON.stringify(lastUsed));
                } catch (e) {
                    console.warn('Failed to save last used transform:', e);
                }
            },
            saveLastUsedTranslate: function(langName, isCustom) {
                try {
                    let lastUsed = this.lastUsedTransforms || [];
                    const c = !!isCustom;
                    lastUsed = lastUsed.filter(item => {
                        if (item.kind === 'translate') {
                            return !(item.lang === langName && !!item.custom === c);
                        }
                        return true;
                    });
                    lastUsed.unshift({
                        kind: 'translate',
                        lang: langName,
                        custom: c,
                        timestamp: Date.now()
                    });
                    lastUsed = lastUsed.slice(0, 5);
                    this.lastUsedTransforms = lastUsed;
                    this.showLastUsed = lastUsed.length > 0;
                    localStorage.setItem('transformLastUsed', JSON.stringify(lastUsed));
                } catch (e) {
                    console.warn('Failed to save last used translate:', e);
                }
            },
            getLastUsedDisplayItems: function() {
                if (!this.lastUsedTransforms || this.lastUsedTransforms.length === 0) {
                    return [];
                }
                const out = [];
                for (let i = 0; i < this.lastUsedTransforms.length; i++) {
                    const item = this.lastUsedTransforms[i];
                    if (item.kind === 'translate') {
                        out.push({
                            type: 'translate',
                            key: 'lu-tx-' + item.lang + '-' + !!item.custom + '-' + (item.timestamp || i),
                            langName: item.lang,
                            custom: !!item.custom
                        });
                    } else if (item.name) {
                        const t = this.transforms.find(tr => tr.name === item.name);
                        if (t) {
                            out.push({ type: 'transform', key: 'lu-tr-' + item.name + '-' + i, transform: t });
                        }
                    }
                }
                return out;
            },
            getFavoriteDisplayItems: function() {
                if (!this.favorites || this.favorites.length === 0) return [];
                const out = [];
                for (let i = 0; i < this.favorites.length; i++) {
                    const f = this.favorites[i];
                    if (typeof f === 'string') {
                        const t = this.transforms.find(tr => tr.name === f);
                        if (t) out.push({ type: 'transform', key: 'fav-tr-' + f, transform: t });
                    } else if (f && f.kind === 'translate' && f.lang) {
                        out.push({
                            type: 'translate',
                            key: 'fav-tx-' + f.lang + '-' + !!f.custom,
                            langName: f.lang,
                            custom: !!f.custom
                        });
                    }
                }
                return out;
            },
            toggleFavorite: function(transformName, event) {
                if (typeof transformName !== 'string') return;
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                const index = this.favorites.indexOf(transformName);
                if (index > -1) {
                    this.favorites.splice(index, 1);
                    this.showNotification('Removed from favorites', 'success', 'fas fa-star');
                } else {
                    this.favorites.push(transformName);
                    this.showNotification('Added to favorites', 'success', 'fas fa-star');
                }
                this.showFavorites = this.favorites.length > 0;
                this.saveFavorites(this.favorites);
            },
            toggleTranslateFavorite: function(langName, custom, event) {
                if (event) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                const c = !!custom;
                const idx = this.favorites.findIndex(f => {
                    if (typeof f === 'string') return false;
                    return f && f.kind === 'translate' && f.lang === langName && !!f.custom === c;
                });
                if (idx > -1) {
                    this.favorites.splice(idx, 1);
                    this.showNotification('Removed from favorites', 'success', 'fas fa-star');
                } else {
                    this.favorites.push({ kind: 'translate', lang: langName, custom: c });
                    this.showNotification('Added to favorites', 'success', 'fas fa-star');
                }
                this.showFavorites = this.favorites.length > 0;
                this.saveFavorites(this.favorites);
            },
            isTranslateFavorite: function(langName, custom) {
                const c = !!custom;
                return this.favorites && this.favorites.some(f =>
                    f && typeof f === 'object' && f.kind === 'translate' &&
                    f.lang === langName && !!f.custom === c
                );
            },
            isFavorite: function(transformName) {
                return this.favorites && this.favorites.includes(transformName);
            },
            getFavoriteTransforms: function() {
                if (!this.favorites || this.favorites.length === 0) {
                    return [];
                }
                return this.favorites
                    .filter(f => typeof f === 'string')
                    .map(transformName => this.transforms.find(t => t.name === transformName))
                    .filter(t => t !== undefined);
            },
            saveFavorites: function(favorites) {
                try {
                    localStorage.setItem('transformFavorites', JSON.stringify(favorites));
                } catch (e) {
                    console.warn('Failed to save favorites:', e);
                }
            },
            moveCategoryUp: function(categoryIndex) {
                if (categoryIndex <= 0) return;
                
                // Never allow moving randomizer itself
                if (this.categories[categoryIndex] === 'randomizer') return;
                
                // Use Vue's array mutation methods for proper reactivity
                const categoryToMove = this.categories[categoryIndex];
                this.categories.splice(categoryIndex, 1);
                this.categories.splice(categoryIndex - 1, 0, categoryToMove);
                
                this.saveCategoryOrder(this.categories);
                this.showNotification('Category order saved', 'success', 'fas fa-check');
            },
            moveCategoryDown: function(categoryIndex) {
                // Don't allow moving if already at or past the last valid position
                // Last position is reserved for randomizer, so we can't move to it
                if (categoryIndex >= this.categories.length - 2) return;
                
                // Never allow moving randomizer itself
                if (this.categories[categoryIndex] === 'randomizer') return;
                
                // Use Vue's array mutation methods for proper reactivity
                const categoryToMove = this.categories[categoryIndex];
                this.categories.splice(categoryIndex, 1);
                this.categories.splice(categoryIndex + 1, 0, categoryToMove);
                
                this.saveCategoryOrder(this.categories);
                this.showNotification('Category order saved', 'success', 'fas fa-check');
            },
            saveCategoryOrder: function(categories) {
                try {
                    // Remove duplicates before saving
                    const uniqueCategories = categories.filter((cat, index, arr) => arr.indexOf(cat) === index);
                    localStorage.setItem('transformCategoryOrder', JSON.stringify(uniqueCategories));
                } catch (e) {
                    console.warn('Failed to save category order:', e);
                }
            },
            autoTransform: function() {
                if (this.transformInput && this.activeTransform && this.activeTab === 'transforms') {
                    const opts = this.getMergedOptionsForTransform(this.activeTransform.name);
                    const segments = window.EmojiUtils.splitEmojis(this.transformInput);
                    const transformedSegments = segments.map(segment => {
                        if (segment.length > 1 || /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u.test(segment)) {
                            return segment;
                        }
                        return this.activeTransform.func(segment, opts);
                    });
                    this.transformOutput = window.EmojiUtils.joinEmojis(transformedSegments);
                }
            },
            initializeCategoryNavigation: function() {
                this.$nextTick(() => {
                    const legendItems = document.querySelectorAll('.transform-category-legend .legend-item');
                    legendItems.forEach(item => {
                        const newItem = item.cloneNode(true);
                        item.parentNode.replaceChild(newItem, item);
                    });
                    
                    document.querySelectorAll('.transform-category-legend .legend-item').forEach(item => {
                        item.addEventListener('click', () => {
                            const targetId = item.getAttribute('data-target');
                            if (targetId) {
                                const targetElement = document.getElementById(targetId);
                                if (targetElement) {
                                    document.querySelectorAll('.transform-category-legend .legend-item').forEach(li => {
                                        li.classList.remove('active-category');
                                    });
                                    item.classList.add('active-category');
                                    
                                    const inputSection = document.querySelector('.input-section');
                                    const inputSectionHeight = inputSection.offsetHeight;
                                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                                    const offsetPosition = elementPosition - inputSectionHeight - 10;
                                    
                                    window.scrollTo({
                                        top: offsetPosition,
                                        behavior: 'smooth'
                                    });
                                    
                                    targetElement.classList.add('highlight-section');
                                    setTimeout(() => {
                                        targetElement.classList.remove('highlight-section');
                                    }, 1000);
                                }
                            }
                        });
                    });
                });
            }
        };
    }
    
    getVueWatchers() {
        return {
            transformInput() {
                if (this.activeTransform && this.activeTab === 'transforms') {
                    const opts = this.getMergedOptionsForTransform(this.activeTransform.name);
                    this.transformOutput = this.activeTransform.func(this.transformInput, opts);
                }
            },
            transformOptionsModalOpen(val) {
                if (typeof document !== 'undefined') {
                    document.body.classList.toggle('transform-options-modal-open', !!val);
                }
            }
        };
    }
    
    getVueLifecycle() {
        return {
            mounted() {
                this.initializeCategoryNavigation();
                
                // Save initial category order to localStorage if it doesn't exist
                // This ensures consistent state for category reordering operations
                try {
                    const saved = localStorage.getItem('transformCategoryOrder');
                    if (!saved && this.categories && this.categories.length > 0) {
                        this.saveCategoryOrder(this.categories);
                    }
                } catch (e) {
                    console.warn('Failed to check/save initial category order:', e);
                }
            }
        };
    }
    
    onActivate(vueInstance) {
        vueInstance.$nextTick(() => {
            vueInstance.initializeCategoryNavigation();
        });
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransformTool;
} else {
    window.TransformTool = TransformTool;
}



