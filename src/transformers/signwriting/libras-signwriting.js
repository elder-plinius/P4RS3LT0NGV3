// LIBRAS SignWriting transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'LIBRAS SignWriting',
    priority: 0,
    canDecode: false,
    description: 'Brazilian Sign Language (Libras) fingerspelling in SignWriting (ISWA 2010). Horizontal or vertical layout.',
    configurableOptions: [
        {
            id: 'layout',
            label: 'Layout',
            type: 'select',
            default: 'horizontal',
            options: [
                { label: 'Horizontal', value: 'horizontal' },
                { label: 'Vertical', value: 'vertical' }
            ]
        }
    ],

    NBSP: '\u00A0',

    librasMap: {
        'A': ['𝣷𝪜'], 'B': ['𝡇𝪜'], 'C': ['𝡭𝪜'],
        'D': ['𝠁𝪜'], 'E': ['𝡊𝪜'],
        'F': ['𝣒𝪜'], 'G': ['𝣟𝪜'], 'H': ['𝧟', '𝡀𝪜𝪧'],
        'I': ['𝢒𝪜'], 'J': ['𝢒𝪟', '𝦢𝪬'], 'K': ['𝤮', '𝡀𝪜'],
        'L': ['𝣜𝪜'], 'M': ['𝢍𝪜'], 'N': ['𝠙𝪜'],
        'O': ['𝡶𝪜'], 'P': ['𝡀𝪟'], 'Q': ['𝣲𝪟'],
        'R': ['𝠚𝪜'], 'S': ['𝤃𝪜'], 'T': ['𝣓𝪜'],
        'U': ['𝠕𝪜'], 'V': ['𝠎𝪜'], 'W': ['𝢇𝪜'],
        'X': ['𝠊𝪟', '𝥥𝪤'], 'Y': ['𝢚𝪜'],
        'Z': ['\u2004𝥅𝪪', '𝠀𝪜'],
        '0': ['𝡶𝪜'], '1': ['𝠀'], '2': ['𝠎'], '3': ['𝢆'],
        '4': ['𝡄'], '5': ['𝠐𝪨'], '6': ['𝡴𝪝𝪮'],
        '7': ['𝢃𝪛'], '8': ['𝧢𝪝', '𝤃𝪛'], '9': ['𝡵𝪟𝪢']
    },

    /**
     * Strip diacritics from text (e.g. Ç → C, É → E)
     */
    stripDiacritics: function(text) {
        // NFD decomposes, then remove combining marks
        var decomposed = text.normalize('NFD');
        var out = '';
        for (var i = 0; i < decomposed.length; i++) {
            // Combining Diacritical Marks block: U+0300–U+036F
            var cp = decomposed.charCodeAt(i);
            if (cp < 0x0300 || cp > 0x036F) {
                out += decomposed[i];
            }
        }
        return out;
    },

    func: function(text, options) {
        var layout = (options && options.layout) || 'horizontal';
        text = this.stripDiacritics(text).toUpperCase();

        if (layout === 'vertical') {
            var words = text.split(/\s+/);
            var wordBlocks = [];
            for (var w = 0; w < words.length; w++) {
                var chars = [];
                for (var c = 0; c < words[w].length; c++) {
                    var sign = this.librasMap[words[w][c]];
                    if (sign) chars.push(sign.join('\n'));
                }
                wordBlocks.push(chars.join('\n\n'));
            }
            return wordBlocks.join('\n\n\n');
        }

        // Horizontal layout
        var SPACE_TOKEN = this.NBSP + this.NBSP;
        var signs = [];
        for (var i = 0; i < text.length; i++) {
            var ch = text[i];
            if (ch === ' ') {
                signs.push([SPACE_TOKEN]);
            } else {
                var sign = this.librasMap[ch];
                if (sign) {
                    signs.push(sign.slice());
                } else {
                    signs.push([ch]);
                }
            }
        }

        var maxH = 1;
        for (var s = 0; s < signs.length; s++) {
            if (signs[s].length > maxH) maxH = signs[s].length;
        }

        var lanes = [];
        for (var r = 0; r < maxH; r++) lanes.push('');

        for (var s = 0; s < signs.length; s++) {
            var padCount = maxH - signs[s].length;
            var padded = [];
            for (var p = 0; p < padCount; p++) padded.push(this.NBSP);
            for (var p = 0; p < signs[s].length; p++) padded.push(signs[s][p]);
            for (var r = 0; r < maxH; r++) {
                lanes[r] += padded[r];
            }
        }
        return lanes.join('\n');
    },

    preview: function(text) {
        if (!text) return '[LIBRAS SignWriting]';
        return this.func(text.slice(0, 5));
    }
});
