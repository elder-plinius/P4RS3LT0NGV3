// uuencoding transform (Unix-to-Unix encoding)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Uuencoding',
    priority: 250,
    category: 'encoding',
    func: function(text) {
        // Uuencoding encodes 3 bytes into 4 characters
        // Each character represents 6 bits (0-63)
        const uuChars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_';
        
        let result = '';
        const bytes = new TextEncoder().encode(text);
        
        for (let i = 0; i < bytes.length; i += 3) {
            const b1 = bytes[i] || 0;
            const b2 = bytes[i + 1] || 0;
            const b3 = bytes[i + 2] || 0;
            
            // Combine 3 bytes (24 bits) into 4 6-bit values
            const val1 = (b1 >> 2) & 0x3F;
            const val2 = ((b1 << 4) | (b2 >> 4)) & 0x3F;
            const val3 = ((b2 << 2) | (b3 >> 6)) & 0x3F;
            const val4 = b3 & 0x3F;
            
            result += uuChars[val1] + uuChars[val2] + uuChars[val3] + uuChars[val4];
        }
        
        return result;
    },
    reverse: function(text) {
        const uuChars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_';
        
        const bytes = [];
        const totalChunks = Math.floor(text.length / 4);
        
        for (let i = 0; i < totalChunks; i++) {
            const chunk = text.substring(i * 4, (i + 1) * 4);
            if (chunk.length < 4) break;
            
            const val1 = uuChars.indexOf(chunk[0]);
            const val2 = uuChars.indexOf(chunk[1]);
            const val3 = uuChars.indexOf(chunk[2]);
            const val4 = uuChars.indexOf(chunk[3]);
            
            if (val1 === -1 || val2 === -1 || val3 === -1 || val4 === -1) continue;
            
            // Reconstruct 3 bytes from 4 6-bit values
            const b1 = (val1 << 2) | (val2 >> 4);
            const b2 = ((val2 << 4) | (val3 >> 2)) & 0xFF;
            const b3 = ((val3 << 6) | val4) & 0xFF;
            
            bytes.push(b1);
            bytes.push(b2);
            bytes.push(b3);
        }
        
        // Remove trailing null bytes (padding)
        while (bytes.length > 0 && bytes[bytes.length - 1] === 0) {
            bytes.pop();
        }
        
        try {
            return new TextDecoder().decode(new Uint8Array(bytes));
        } catch (e) {
            return '';
        }
    },
    preview: function(text) {
        if (!text) return '[uuencoding]';
        const result = this.func(text.slice(0, 3));
        return result.substring(0, 8) + '...';
    },
    detector: function(text) {
        // Uuencoding uses specific character set: space through underscore (ASCII 32-95)
        const uuPattern = /^[ !"#$%&'()*+,\-./0-9:;<=>?@A-Z[\\\]^_]+$/;
        return text.length >= 8 && uuPattern.test(text) && text.length % 4 === 0;
    }
});

