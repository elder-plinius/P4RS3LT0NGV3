// ROT8000 cipher transform (Unicode rotation)
// Wrapped in IIFE so build/build-transforms.js (which strips `export default`) produces
// transforms['rot8000'] = (() => { ... return new BaseTransformer(...) })();
// Top-level helper functions alone would otherwise bind to the first `function`, not the transformer.
import BaseTransformer from '../BaseTransformer.js';

export default (() => {
    function buildValidCodes() {
        const validCodes = [];
        for (let i = 0; i <= 0xFFFF; i++) {
            if (i >= 0x0000 && i <= 0x001F) continue;
            if (i >= 0x007F && i <= 0x00A0) continue;
            if (i >= 0xD800 && i <= 0xDFFF) continue;
            validCodes.push(i);
        }
        return validCodes;
    }

    let cachedValidCodes = null;
    let cachedCodeToIndex = null;
    let cachedShift = null;

    function getRot8000Data() {
        if (!cachedValidCodes) {
            cachedValidCodes = buildValidCodes();
            cachedShift = Math.floor(cachedValidCodes.length / 2);
            cachedCodeToIndex = new Map();
            cachedValidCodes.forEach((code, index) => {
                cachedCodeToIndex.set(code, index);
            });
        }
        return { validCodes: cachedValidCodes, codeToIndex: cachedCodeToIndex, shift: cachedShift };
    }

    return new BaseTransformer({
        name: 'ROT8000',
        priority: 50,
        category: 'cipher',
        func: function(text) {
            const { validCodes, codeToIndex, shift } = getRot8000Data();
            const validCount = validCodes.length;

            let result = '';

            for (let i = 0; i < text.length; i++) {
                const code = text.charCodeAt(i);

                if (codeToIndex.has(code)) {
                    const index = codeToIndex.get(code);
                    const rotatedIndex = (index + shift) % validCount;
                    const rotatedCode = validCodes[rotatedIndex];
                    result += String.fromCharCode(rotatedCode);
                } else {
                    result += text[i];
                }
            }

            return result;
        },
        reverse: function(text) {
            return this.func(text);
        },
        preview: function(text) {
            if (!text) return '[rot8000]';
            return this.func(text.slice(0, 8)) + (text.length > 8 ? '...' : '');
        },
        detector: function(text) {
            const hasNonAscii = /[^\x00-\x7F]/.test(text);
            const hasControlChars = /[\x00-\x1F]/.test(text);
            return hasNonAscii && text.length >= 5;
        }
    });
})();
