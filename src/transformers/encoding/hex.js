// hex transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Hexadecimal',
    priority: 290,
    inputKind: 'textarea',
    configurableOptions: [
        {
            id: 'pairSpacing',
            label: 'Space between byte pairs',
            type: 'boolean',
            default: true
        }
    ],
    // Detector: Only hex characters (0-9, A-F)
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && /^[0-9A-Fa-f]+$/.test(cleaned);
    },
    
    func: function(text, options) {
            options = options || {};
            const spacing = options.pairSpacing !== false;
            const encoder = new TextEncoder();
            const bytes = encoder.encode(text);
            const pairs = Array.from(bytes).map(b => b.toString(16).padStart(2, '0'));
            return spacing ? pairs.join(' ') : pairs.join('');
        },
        preview: function(text, options) {
            if (!text) return '[hex]';
            const full = this.func(text, options);
            return full.substring(0, 20) + (full.length > 20 ? '...' : '');
        },
        reverse: function(text, options) {
            options = options || {};
            const hexText = text.replace(/\s+/g, '');
            const bytes = [];
            
            for (let i = 0; i < hexText.length; i += 2) {
                const byte = hexText.substr(i, 2);
                if (byte.length === 2) {
                    bytes.push(parseInt(byte, 16));
                }
            }
            
            // Use TextDecoder to properly decode UTF-8
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(new Uint8Array(bytes));
        }

});