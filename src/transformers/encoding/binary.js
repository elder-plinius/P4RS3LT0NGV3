// binary transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Binary',
    priority: 300,
    inputKind: 'textarea',
    configurableOptions: [
        {
            id: 'byteSpacing',
            label: 'Space between bytes',
            type: 'boolean',
            default: true
        }
    ],
    // Detector: Only 0s, 1s, and spaces
    detector: function(text) {
        const cleaned = text.trim();
        const noSpaces = cleaned.replace(/\s/g, '');
        return noSpaces.length >= 8 && /^[01\s]+$/.test(cleaned);
    },
    
    func: function(text, options) {
            options = options || {};
            const spacing = options.byteSpacing !== false;
            const encoder = new TextEncoder();
            const bytes = encoder.encode(text);
            const bits = Array.from(bytes).map(b => b.toString(2).padStart(8, '0'));
            return spacing ? bits.join(' ') : bits.join('');
        },
        preview: function(text, options) {
            if (!text) return '[binary]';
            const full = this.func(text, options);
            return full.substring(0, 24) + (full.length > 24 ? '...' : '');
        },
        reverse: function(text, options) {
            options = options || {};
            // Remove spaces and ensure we have valid binary
            const binText = text.replace(/\s+/g, '');
            const bytes = [];
            
            // Process 8 bits at a time
            for (let i = 0; i < binText.length; i += 8) {
                const byte = binText.substr(i, 8);
                if (byte.length === 8) {
                    bytes.push(parseInt(byte, 2));
                }
            }
            
            // Use TextDecoder to properly decode UTF-8
            const decoder = new TextDecoder('utf-8');
            return decoder.decode(new Uint8Array(bytes));
        }

});