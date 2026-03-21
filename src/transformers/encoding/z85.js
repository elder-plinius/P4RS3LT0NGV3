// z85 encoding (ZeroMQ Base85)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Z85',
    priority: 250,
    category: 'encoding',
    // Z85 uses a different character set than standard Base85
    charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#',
    func: function(text) {
        const bytes = new TextEncoder().encode(text);
        let result = '';
        const originalLength = bytes.length;
        
        // Z85 encodes 4 bytes into 5 characters
        for (let i = 0; i < bytes.length; i += 4) {
            const chunk = Array.from(bytes.slice(i, i + 4));
            const chunkLength = chunk.length;
            while (chunk.length < 4) chunk.push(0);
            
            // Convert 4 bytes to 32-bit integer
            let value = 0;
            for (let j = 0; j < 4; j++) {
                value = (value << 8) + chunk[j];
            }
            
            // Convert to base 85 (5 digits)
            const z85Chars = [];
            for (let j = 0; j < 5; j++) {
                z85Chars.unshift(this.charset[value % 85]);
                value = Math.floor(value / 85);
            }
            
            result += z85Chars.join('');
        }
        
        // Store original length for decoding
        this._z85OriginalLength = originalLength;
        
        return result;
    },
    reverse: function(text) {
        const bytes = [];
        
        // Z85 decodes 5 characters into 4 bytes
        for (let i = 0; i < text.length; i += 5) {
            const chunk = text.substring(i, i + 5);
            if (chunk.length < 5) break;
            
            // Convert 5 base-85 digits to 32-bit integer
            let value = 0;
            for (const char of chunk) {
                const idx = this.charset.indexOf(char);
                if (idx === -1) return ''; // Invalid character
                value = value * 85 + idx;
            }
            
            // Extract 4 bytes
            bytes.push((value >> 24) & 0xFF);
            bytes.push((value >> 16) & 0xFF);
            bytes.push((value >> 8) & 0xFF);
            bytes.push(value & 0xFF);
        }
        
        // Trim to original length if we stored it
        if (this._z85OriginalLength !== undefined) {
            bytes.length = Math.min(bytes.length, this._z85OriginalLength);
        } else {
            // Remove trailing null bytes (padding)
            while (bytes.length > 0 && bytes[bytes.length - 1] === 0) {
                bytes.pop();
            }
        }
        
        try {
            return new TextDecoder().decode(new Uint8Array(bytes));
        } catch (e) {
            return '';
        }
    },
    preview: function(text) {
        if (!text) return '[z85]';
        const result = this.func(text.slice(0, 4));
        return result.substring(0, 10) + '...';
    },
    detector: function(text) {
        // Z85 uses specific character set
        const z85Pattern = /^[0-9a-zA-Z.\-:+=^!\/\*\?&<>()\[\]{}@%$#]+$/;
        return text.length >= 5 && z85Pattern.test(text) && text.length % 5 === 0;
    }
});

