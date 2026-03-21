// XOR cipher transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'XOR Cipher',
    priority: 70,
    category: 'cipher',
    key: 'KEY', // Default key
    func: function(text) {
        const key = this.key || 'KEY';
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
    reverse: function(text) {
        // XOR is self-reciprocal, but we need to convert from hex first
        try {
            const hexBytes = text.match(/.{1,2}/g) || [];
            const bytes = new Uint8Array(hexBytes.map(h => parseInt(h, 16)));
            const key = this.key || 'KEY';
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
    preview: function(text) {
        if (!text) return '[xor]';
        const result = this.func(text.slice(0, 4));
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

