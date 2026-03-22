// bitwise NOT transform
// Encode: UTF-8 bytes → NOT each byte → lossless lowercase hex (invalid UTF-8 after NOT is common).
// Decode: hex → bytes → NOT each byte → UTF-8 decode (exact inverse of encode).
// Helpers must live inside the default export: build-transforms.js concatenates the file body
// into transforms[name] = … so multiple top-level declarations would assign the wrong value.
import BaseTransformer from '../BaseTransformer.js';

export default (function () {
    function utf8BytesBitwiseNot(bytes) {
        const out = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
            out[i] = ~bytes[i] & 0xFF;
        }
        return out;
    }

    function bytesToHex(bytes) {
        return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    function hexToBytes(hex) {
        const cleaned = hex.replace(/\s+/g, '').replace(/0x/gi, '');
        if (cleaned.length % 2 !== 0) {
            return null;
        }
        if (!/^[0-9a-fA-F]*$/.test(cleaned)) {
            return null;
        }
        const out = new Uint8Array(cleaned.length / 2);
        for (let i = 0; i < out.length; i++) {
            out[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
        }
        return out;
    }

    return new BaseTransformer({
    name: 'Bitwise NOT',
    priority: 100,
    category: 'format',
    func: function(text) {
        const bytes = new TextEncoder().encode(text);
        const inverted = utf8BytesBitwiseNot(bytes);
        return bytesToHex(inverted);
    },
    reverse: function(text) {
        const inverted = hexToBytes(text);
        if (!inverted) {
            return '[invalid hex - paste the hex from encode; spaces allowed]';
        }
        const bytes = utf8BytesBitwiseNot(inverted);
        try {
            return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        } catch (e) {
            return '[invalid UTF-8 after inverse NOT]';
        }
    },
    preview: function(text) {
        if (!text) return '[bitwise-not]';
        const h = this.func(text.slice(0, 5));
        return h.length > 24 ? `${h.slice(0, 24)}…` : h;
    },
    detector: function(text) {
        const t = text.trim().replace(/\s+/g, '');
        if (t.length < 8 || t.length % 2 !== 0) return false;
        return /^[0-9a-fA-F]+$/.test(t);
    }
    });
})();

