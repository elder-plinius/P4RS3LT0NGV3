// XOR cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'XOR Cipher',
    priority: 70,
    category: 'cipher',
    key: 'KEY',
    configurableOptions: [
        {
            id: 'key',
            label: 'XOR key (string)',
            type: 'text',
            default: 'KEY'
        }
    ],
    _key: function(options) {
        const k = options && options.key !== undefined && options.key !== null
            ? String(options.key)
            : null;
        return k || this.key || 'KEY';
    },
    func: function(text, options) {
        const key = this._key(options || {});
        const keyBytes = new TextEncoder().encode(key);
        const textBytes = new TextEncoder().encode(text);
        const result = new Uint8Array(textBytes.length);
        
        for (let i = 0; i < textBytes.length; i++) {
            result[i] = textBytes[i] ^ keyBytes[i % keyBytes.length];
        }
        
        // Convert to hex string
        return Array.from(result)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },
    reverse: function(text, options) {
        try {
            const hexBytes = text.match(/.{1,2}/g) || [];
            const bytes = new Uint8Array(hexBytes.map(h => parseInt(h, 16)));
            const key = this._key(options || {});
            const keyBytes = new TextEncoder().encode(key);
            const result = new Uint8Array(bytes.length);
            
            for (let i = 0; i < bytes.length; i++) {
                result[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
            }
            
            return new TextDecoder().decode(result);
        } catch (e) {
            return text;
        }
    },
    preview: function(text, options) {
        if (!text) return '[xor]';
        const result = this.func(text.slice(0, 4), options);
        return result.substring(0, 12) + '...';
    },
    detector: function(text) {
        // Check if text is hex-encoded (XOR cipher output)
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 4 && 
               cleaned.length % 2 === 0 && 
               /^[0-9a-fA-F]+$/.test(cleaned);
    }
});

