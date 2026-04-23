// ASL SignWriting transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'ASL SignWriting',
    priority: 0,
    canDecode: false,
    description: 'American Sign Language fingerspelling in SignWriting (ISWA 2010). Horizontal or vertical layout.',
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

    THIN: '\u2004',
    NBSP: '\u00A0',

    aslMap: {
        'A': '𝣷𝪜', 'B': '𝡇𝪜', 'C': '𝡭𝪜', 'D': '𝠁𝪜', 'E': '𝡊𝪜',
        'F': '𝣎𝪜', 'G': '𝣰', 'H': '𝠕𝪢', 'I': '𝢒𝪜',
        'J': '𝦢𝪬\n𝢒𝪜', 'K': '𝡀𝪜', 'L': '𝣜𝪜', 'M': '𝢍𝪜',
        'N': '𝠙𝪜', 'O': '𝡶𝪜', 'P': '𝡀𝪜𝪡', 'Q': '𝣱𝪜𝪡',
        'R': '𝠚𝪜', 'S': '𝤃𝪜', 'T': '𝣻𝪜', 'U': '𝠕𝪜',
        'V': '𝠎𝪜', 'W': '𝢇𝪜', 'X': '𝠆𝪜', 'Y': '𝢚𝪜',
        'Z': '\u2004𝥅𝪪\n𝠀𝪜',
        '.': '𝪈𝪢', ',': '𝪇𝪢', ':': '𝪊𝪢', ';': '𝪉𝪢',
        '(': '𝪋𝪢', ')': '𝪋𝪦', '?': '𝦟𝪝𝪬\n𝠀𝪜',
        '0': '𝡶𝪜', '1': '𝠀𝪜', '2': '𝠎𝪜', '3': '𝠞𝪜',
        '4': '𝡄𝪜', '5': '𝡌𝪜', '6': '𝢇𝪜', '7': '𝢥𝪜',
        '8': '𝢻𝪜', '9': '𝣎𝪜'
    },

    func: function(text, options) {
        var layout = (options && options.layout) || 'horizontal';
        text = text.toUpperCase();

        if (layout === 'vertical') {
            var words = text.split(/\s+/);
            var wordBlocks = [];
            for (var w = 0; w < words.length; w++) {
                var chars = [];
                for (var c = 0; c < words[w].length; c++) {
                    var val = this.aslMap[words[w][c]];
                    if (val !== undefined) chars.push(val);
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
                var val = this.aslMap[ch];
                if (val !== undefined) {
                    signs.push(val.split('\n'));
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
        if (!text) return '[ASL SignWriting]';
        return this.func(text.slice(0, 5));
    }
});
