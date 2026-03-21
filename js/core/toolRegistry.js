/**
 * Tool Registry and Loader
 * Manages all available tools and provides dynamic loading
 */

// Import all tools (they should be loaded before this file)
// Tools will be registered here

class ToolRegistry {
    constructor() {
        this.tools = new Map();
        this.toolsArray = [];
    }
    
    /**
     * Register a tool
     * @param {Tool} tool - Tool instance to register
     */
    register(tool) {
        if (!(tool instanceof Tool)) {
            console.error('Tool must be an instance of Tool class');
            return;
        }
        
        if (!tool.enabled) {
            return;
        }
        
        this.tools.set(tool.id, tool);
        this.toolsArray.push(tool);
        
        // Sort by order
        this.toolsArray.sort((a, b) => a.order - b.order);
    }
    
    /**
     * Get a tool by ID
     * @param {string} id - Tool ID
     * @returns {Tool|null}
     */
    get(id) {
        return this.tools.get(id) || null;
    }
    
    /**
     * Get all registered tools
     * @returns {Array<Tool>}
     */
    getAll() {
        return this.toolsArray;
    }
    
    /**
     * Get all enabled tools
     * @returns {Array<Tool>}
     */
    getEnabled() {
        return this.toolsArray.filter(tool => tool.enabled);
    }
    
    /**
     * Merge Vue data from all tools
     * @returns {Object}
     */
    mergeVueData() {
        const merged = {};
        this.toolsArray.forEach(tool => {
            const toolData = tool.getVueData();
            Object.assign(merged, toolData);
        });
        return merged;
    }
    
    /**
     * Merge Vue methods from all tools
     * @returns {Object}
     */
    mergeVueMethods() {
        const merged = {};
        this.toolsArray.forEach(tool => {
            const toolMethods = tool.getVueMethods();
            Object.assign(merged, toolMethods);
        });
        return merged;
    }
    
    /**
     * Merge Vue watchers from all tools
     * @returns {Object}
     */
    mergeVueWatchers() {
        const merged = {};
        this.toolsArray.forEach(tool => {
            const toolWatchers = tool.getVueWatchers();
            Object.assign(merged, toolWatchers);
        });
        return merged;
    }
    
    /**
     * Merge Vue lifecycle hooks from all tools
     * @returns {Object}
     */
    mergeVueLifecycle() {
        const merged = {};
        this.toolsArray.forEach(tool => {
            const toolLifecycle = tool.getVueLifecycle();
            Object.keys(toolLifecycle).forEach(hook => {
                if (!merged[hook]) {
                    merged[hook] = [];
                }
                merged[hook].push(toolLifecycle[hook]);
            });
        });
        
        // Convert arrays to functions that call all hooks
        const result = {};
        Object.keys(merged).forEach(hook => {
            result[hook] = function() {
                const args = arguments;
                merged[hook].forEach(fn => {
                    if (typeof fn === 'function') {
                        fn.apply(this, args);
                    }
                });
            };
        });
        
        return result;
    }
    
    /**
     * Generate HTML for all tab buttons
     * @returns {String}
     */
    generateTabButtonsHTML() {
        return this.toolsArray.map(tool => tool.getTabButtonHTML()).join('\n');
    }
    
    /**
     * Generate HTML for all tab content
     * @returns {String}
     */
    generateTabContentHTML() {
        return this.toolsArray.map(tool => tool.getTabContentHTML()).join('\n');
    }
    
    /**
     * Handle tool activation
     * @param {string} toolId - Tool ID
     * @param {Vue} vueInstance - Vue instance
     */
    activateTool(toolId, vueInstance) {
        const tool = this.get(toolId);
        if (tool && typeof tool.onActivate === 'function') {
            tool.onActivate(vueInstance);
        }
    }
    
    /**
     * Handle tool deactivation
     * @param {string} toolId - Tool ID
     * @param {Vue} vueInstance - Vue instance
     */
    deactivateTool(toolId, vueInstance) {
        const tool = this.get(toolId);
        if (tool && typeof tool.onDeactivate === 'function') {
            tool.onDeactivate(vueInstance);
        }
    }
}

// Create global registry instance
window.ToolRegistry = ToolRegistry;
window.toolRegistry = new ToolRegistry();

// Auto-register tools if they're available
if (typeof DecodeTool !== 'undefined') {
    window.toolRegistry.register(new DecodeTool());
}
if (typeof EmojiTool !== 'undefined') {
    window.toolRegistry.register(new EmojiTool());
}
if (typeof GibberishTool !== 'undefined') {
    window.toolRegistry.register(new GibberishTool());
}
if (typeof MutationTool !== 'undefined') {
    window.toolRegistry.register(new MutationTool());
}
if (typeof PromptCraftTool !== 'undefined') {
    window.toolRegistry.register(new PromptCraftTool());
}
if (typeof SplitterTool !== 'undefined') {
    window.toolRegistry.register(new SplitterTool());
}
if (typeof TokenadeTool !== 'undefined') {
    window.toolRegistry.register(new TokenadeTool());
}
if (typeof TokenizerTool !== 'undefined') {
    window.toolRegistry.register(new TokenizerTool());
}
if (typeof TransformTool !== 'undefined') {
    window.toolRegistry.register(new TransformTool());
}
if (typeof TranslateTool !== 'undefined') {
    window.toolRegistry.register(new TranslateTool());
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ToolRegistry;
}



