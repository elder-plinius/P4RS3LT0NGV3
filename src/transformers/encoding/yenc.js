// yenc encoding transform (Usenet binary encoding)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'YEnc',
    priority: 250,
    category: 'encoding',
    func: function(text) {
        // YEnc encodes bytes by adding 42 (0x2A) and escaping special characters
        const bytes = new TextEncoder().encode(text);
        let result = '';
        
        for (const byte of bytes) {
            let encoded = (byte + 42) % 256;
            
            // Escape special characters: NULL (0), LF (10), CR (13), = (61)
            if (encoded === 0 || encoded === 10 || encoded === 13 || encoded === 61) {
                result += '=' + String.fromCharCode((encoded + 64) % 256);
            } else {
                result += String.fromCharCode(encoded);
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const bytes = [];
        let i = 0;
        
        while (i < text.length) {
            if (text[i] === '=' && i + 1 < text.length) {
                // Escaped character
                const escaped = text.charCodeAt(i + 1);
                const decoded = (escaped - 64) % 256;
                bytes.push((decoded - 42 + 256) % 256);
                i += 2;
            } else {
                // Normal character
                const encoded = text.charCodeAt(i);
                bytes.push((encoded - 42 + 256) % 256);
                i++;
            }
        }
        
        try {
            return new TextDecoder().decode(new Uint8Array(bytes));
        } catch (e) {
            return '';
        }
    },
    preview: function(text) {
        if (!text) return '[yenc]';
        const result = this.func(text.slice(0, 3));
        return result.substring(0, 8) + '...';
    },
    detector: function(text) {
        // YEnc produces binary-like data, hard to detect reliably
        // Check for escape sequences (= followed by character)
        const escapePattern = /=[\x00-\xFF]/;
        return escapePattern.test(text) && text.length >= 8;
    }
});

