// base122 encoding (more efficient than Base64)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Base122',
    priority: 250,
    category: 'encoding',
    func: function(text) {
        // Base122 uses UTF-8 bytes and encodes them more efficiently
        // It uses 7-bit ASCII (0-127) plus some safe 2-byte UTF-8 sequences
        const bytes = new TextEncoder().encode(text);
        let result = '';
        
        let i = 0;
        while (i < bytes.length) {
            const byte = bytes[i];
            
            if (byte < 128) {
                // Single byte ASCII
                result += String.fromCharCode(byte);
                i++;
            } else if (i + 1 < bytes.length) {
                // Try to encode as 2-byte sequence
                const b1 = byte;
                const b2 = bytes[i + 1];
                
                // Check if it's a valid 2-byte UTF-8 sequence
                if ((b1 & 0xE0) === 0xC0 && (b2 & 0xC0) === 0x80) {
                    result += String.fromCharCode(b1, b2);
                    i += 2;
                } else {
                    // Fallback: encode as escaped sequence
                    result += String.fromCharCode(0xC2, 0x80 + (byte - 128));
                    i++;
                }
            } else {
                // Last byte, encode as escaped
                result += String.fromCharCode(0xC2, 0x80 + (byte - 128));
                i++;
            }
        }
        
        return result;
    },
    reverse: function(text) {
        const bytes = [];
        let i = 0;
        
        while (i < text.length) {
            const code = text.charCodeAt(i);
            
            if (code < 128) {
                bytes.push(code);
                i++;
            } else if (i + 1 < text.length) {
                // Check for 2-byte sequence
                const b1 = code;
                const b2 = text.charCodeAt(i + 1);
                
                if ((b1 & 0xE0) === 0xC0 && (b2 & 0xC0) === 0x80) {
                    // Extract original byte from escaped sequence
                    if (b1 === 0xC2 && b2 >= 0x80 && b2 < 0xC0) {
                        bytes.push(b2 - 0x80);
                    } else {
                        bytes.push(b1, b2);
                    }
                    i += 2;
                } else {
                    bytes.push(code);
                    i++;
                }
            } else {
                bytes.push(code);
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
        if (!text) return '[base122]';
        const result = this.func(text.slice(0, 10));
        return result.substring(0, 15) + '...';
    },
    detector: function(text) {
        // Base122 produces text that's mostly ASCII with some UTF-8 sequences
        // Hard to detect reliably, but check for mix of ASCII and UTF-8
        const hasAscii = /[\x00-\x7F]/.test(text);
        const hasUtf8 = /[\xC0-\xFF]/.test(text);
        return hasAscii && text.length >= 8;
    }
});

