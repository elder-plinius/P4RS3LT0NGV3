/**
 * Base Transformer Class
 * 
 * Provides default implementations and structure for all text transformers.
 * 
 * USAGE:
 * 
 * 1. Simple character map transformer (auto-generates reverse):
 * 
 *    export default new BaseTransformer({
 *        name: 'My Transform',
 *        priority: 85,
 *        map: { 'a': 'α', 'b': 'β', ... },
 *        func: function(text) {
 *            return [...text].map(c => this.map[c] || c).join('');
 *        }
 *    });
 * 
 * 2. Custom transformer with manual reverse:
 * 
 *    export default new BaseTransformer({
 *        name: 'ROT13',
 *        priority: 60,
 *        func: function(text) { ... },
 *        reverse: function(text) { ... }
 *    });
 * 
 * 3. Encoding-only transformer (no reverse):
 * 
 *    export default new BaseTransformer({
 *        name: 'Random Mix',
 *        priority: 0,
 *        canDecode: false,
 *        func: function(text) { ... }
 *    });
 * 
 * 4. Transform with user options (gear icon in UI) and optional input kind:
 * 
 *    export default new BaseTransformer({
 *        name: 'Binary',
 *        inputKind: 'textarea', // 'textarea' | 'text' — main transform input when active
 *        configurableOptions: [
 *            { id: 'byteSpacing', label: 'Space between bytes', type: 'boolean', default: true }
 *        ],
 *        func: function(text, options = {}) { ... }
 *    });
 */

export class BaseTransformer {
    /**
     * Create a new transformer
     * @param {Object} config - Transformer configuration
     * @param {string} config.name - Display name (required)
     * @param {Function} config.func - Encoding function (required)
     * @param {number} [config.priority=85] - Decoder priority (1-310)
     * @param {Object} [config.map] - Character mapping (if provided, auto-generates reverse)
     * @param {Function} [config.reverse] - Custom decoder function (text, options) — options match encode prefs
     * @param {Function} [config.preview] - Preview function (defaults to func)
     * @param {Function} [config.detector] - Custom detection function (text) => boolean
     * @param {boolean} [config.canDecode=true] - Whether this transformer can decode
     * @param {string} [config.category] - Category for organization
     * @param {string} [config.description] - Help text
     * @param {'textarea'|'text'} [config.inputKind='textarea'] - Transform input control when this transform is active
     * @param {Array<Object>} [config.configurableOptions] - Option definitions; shows gear when non-empty
     *        Each: { id, label, type: 'boolean'|'select'|'text'|'number', default, options?, min?, max?, step? }
     */
    constructor(config) {
        if (!config.name || !config.func) {
            throw new Error('Transformer requires at least "name" and "func"');
        }

        // Copy ALL config properties to instance first (for custom properties like alphabet, etc.)
        Object.assign(this, config);
        
        // Override with properly bound functions
        this.func = config.func.bind(this);
        this.priority = config.priority ?? 85; // Default: Unicode transformations
        this.canDecode = config.canDecode ?? true;
        
        // Preview function (defaults to func)
        if (config.preview) {
            this.preview = config.preview.bind(this);
        } else {
            this.preview = this.func;
        }
        
        // Detector function (for universal decoder)
        if (config.detector) {
            this.detector = config.detector.bind(this);
        } else {
            this.detector = null;
        }
        
        // Reverse/decode function
        if (!this.canDecode) {
            // Explicitly cannot decode
            this.reverse = null;
        } else if (config.reverse) {
            // Custom reverse function provided
            this.reverse = config.reverse.bind(this);
        } else if (config.map) {
            // Auto-generate reverse from character map
            this.reverse = this._autoReverse.bind(this);
        } else {
            // No reverse available (but might be added later)
            this.reverse = null;
        }
    }

    /**
     * Auto-generated reverse function for character map transformers
     * Builds a reverse map and decodes character-by-character
     * @private
     */
    _autoReverse(text) {
        if (!this.map) return text;
        
        // Build reverse map (cached for performance)
        if (!this._reverseMap) {
            this._reverseMap = {};
            for (const [key, value] of Object.entries(this.map)) {
                this._reverseMap[value] = key;
            }
        }
        
        return [...text].map(c => this._reverseMap[c] || c).join('');
    }

    /**
     * Get transformer info as JSON
     */
    toJSON() {
        return {
            name: this.name,
            priority: this.priority,
            canDecode: this.canDecode,
            category: this.category,
            description: this.description,
            hasMap: !!this.map,
            hasReverse: !!this.reverse
        };
    }
}

/**
 * PRIORITY GUIDE:
 * 
 * 310 = Semaphore Flags (only 8 specific arrow emojis)
 * 300 = Exclusive character sets (Binary, Morse, Braille, Brainfuck, Tap Code)
 * 290 = Hexadecimal
 * 285 = Pattern-based (Pig Latin, Dovahzul)
 * 280 = Base32
 * 270-275 = Base64/Base58 family
 * 260 = A1Z26
 * 150 = Active transform (user context)
 * 100 = High confidence (Emoji Steganography, unique Unicode ranges)
 * 85 = Unicode transformations (default for fancy text)
 * 70 = Common encodings (URL, HTML, ASCII85)
 * 60 = Ciphers (ROT13, Caesar)
 * 50 = Generic text transforms
 * 20 = Low confidence generic
 * 1 = Invisible text (last resort)
 * 0 = Cannot decode / encode-only
 */

export default BaseTransformer;

