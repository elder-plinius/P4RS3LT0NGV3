// quoted-printable encoding transform (RFC 2045)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Quoted-Printable',
    priority: 70,
    category: 'encoding',
    func: function(text) {
        const bytes = new TextEncoder().encode(text);
        let result = '';
        
        for (let i = 0; i < bytes.length; i++) {
            const byte = bytes[i];
            // Printable ASCII (33-126) except = (61) can be used as-is
            // Space (32) can be used, but often encoded as =20
            // = (61) must be encoded as =3D
            if (byte >= 33 && byte <= 60 || byte >= 63 && byte <= 126) {
                result += String.fromCharCode(byte);
            } else if (byte === 32) {
                // Space can be space or =20
                result += ' ';
            } else {
                // Encode as =XX
                result += '=' + byte.toString(16).toUpperCase().padStart(2, '0');
            }
        }
        
        // Soft line breaks: lines should not exceed 76 chars (excluding CRLF)
        // For simplicity, we'll add = at end of long lines
        const lines = [];
        let currentLine = '';
        for (let i = 0; i < result.length; i++) {
            if (currentLine.length >= 75) {
                lines.push(currentLine + '=');
                currentLine = result[i];
            } else {
                currentLine += result[i];
            }
        }
        if (currentLine) lines.push(currentLine);
        
        return lines.join('\r\n');
    },
    reverse: function(text) {
        try {
            // Remove soft line breaks (= at end of line)
            let cleaned = text.replace(/=\r?\n/g, '').replace(/=\r/g, '');
            let result = '';
            
            for (let i = 0; i < cleaned.length; i++) {
                if (cleaned[i] === '=' && i + 2 < cleaned.length) {
                    const hex = cleaned.substring(i + 1, i + 3);
                    const byte = parseInt(hex, 16);
                    if (!isNaN(byte)) {
                        result += String.fromCharCode(byte);
                        i += 2;
                        continue;
                    }
                }
                result += cleaned[i];
            }
            
            return new TextDecoder().decode(new TextEncoder().encode(result));
        } catch (e) {
            return text;
        }
    },
    preview: function(text) {
        if (!text) return '[qp]';
        const result = this.func(text.slice(0, 10));
        return result.substring(0, 20).replace(/\r?\n/g, ' ') + '...';
    },
    detector: function(text) {
        // Check for quoted-printable patterns (=XX hex codes)
        return /=([0-9A-F]{2})/i.test(text);
    }
});

