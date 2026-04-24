// JSL SignWriting transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'JSL SignWriting',
    priority: 0,
    canDecode: false,
    description: 'Japanese Sign Language fingerspelling in SignWriting (ISWA 2010). Hiragana input.',
    configurableOptions: [
        { id: 'layout', label: 'Layout', type: 'select', default: 'horizontal',
          options: [{ label: 'Horizontal', value: 'horizontal' }, { label: 'Vertical', value: 'vertical' }] }
    ],
    NBSP: '\u00A0',
    SEP: '\u2001',
    jslMap: {
        'あ': ['𝣷𝪜'], 'ぁ': ['𝥥𝪤', '𝣷𝪜'], 'い': ['𝢒𝪜'], 'ぃ': ['𝥥𝪤', '𝢒𝪜'],
        'う': ['𝠕𝪜'], 'ぅ': ['𝥥𝪤', '𝠕𝪜'], 'え': ['𝡦𝪜'], 'ぇ': ['𝥥𝪤', '𝡦𝪜'],
        'お': ['𝡶𝪛'], 'ぉ': ['𝥥𝪤', '𝡶𝪛'], 'か': ['𝡀𝪜'], 'ゕ': ['𝥥𝪤', '𝡀𝪜'],
        'き': ['𝣮𝪜𝪦'], 'く': ['𝡝𝪢'], 'け': ['𝡇𝪜'], 'ゖ': ['𝥥𝪤', '𝡇𝪜'],
        'こ': ['𝢀𝪛'], 'さ': ['𝤃𝪜'], 'し': ['𝠞𝪢'], 'す': ['𝠞𝪤'], 'せ': ['𝣆𝪜'], 'そ': ['𝠀𝪞'],
        'た': ['𝣷𝪞'], 'ち': ['𝢖𝪜'], 'つ': ['𝢳𝪜'], 'っ': ['𝥥𝪤', '𝢳𝪜'],
        'て': ['𝡌𝪜'], 'と': ['𝠕'], 'な': ['𝠎𝪤'], 'に': ['𝠎𝪢'], 'ぬ': ['𝠆𝪛'], 'ね': ['𝡌𝪤'],
        'の': ['𝤪𝪣', '𝠀𝪛'], 'は': ['𝠕𝪞'], 'ひ': ['𝠀𝪜'], 'ふ': ['𝣰𝪟𝪡'], 'へ': ['𝢚𝪟'], 'ほ': ['𝢀𝪝'],
        'ま': ['𝢌𝪤'], 'み': ['𝢌𝪢'], 'む': ['𝣜𝪢'], 'め': ['𝣎𝪜'], 'も': ['𝤪𝪤', '𝤜𝣴𝪝𝪦'],
        'や': ['𝢚𝪜'], 'ゃ': ['𝥥𝪤', '𝢚𝪜'], 'ゆ': ['𝢌'], 'ゅ': ['𝥥𝪤', '𝢌'],
        'よ': ['𝡄𝪢'], 'ょ': ['𝥥𝪤', '𝡄𝪢'], 'ら': ['𝠚𝪜'], 'り': ['𝦢𝪬', '𝠎𝪞'], 'る': ['𝠞𝪜'],
        'れ': ['𝣜𝪜'], 'ろ': ['𝠐𝪛'], 'わ': ['𝢆𝪜'], 'ゎ': ['𝥥𝪤', '𝢆𝪜'],
        'ゐ': ['𝥥𝪤', '𝢒𝪜'], 'ゑ': ['𝥥𝪤', '𝡦𝪜'], 'を': ['𝥥𝪤', '𝡶𝪛'],
        'ん': ['𝦢𝪤', '𝠀𝪞'],
        'が': ['𝡀𝪜𝥥𝪦'], 'ぎ': ['𝣮𝪜𝪦𝥥𝪦'], 'ぐ': ['𝡝𝪢𝥥𝪦'], 'げ': ['𝡇𝪜𝥥𝪦'], 'ご': ['𝢀𝪛𝥥𝪦'],
        'ざ': ['𝤃𝪜𝥥𝪦'], 'じ': ['𝠞𝪢𝥥𝪦'], 'ず': ['𝠞𝪤𝥥𝪦'], 'ぜ': ['𝣆𝪜𝥥𝪦'], 'ぞ': ['𝠀𝪞𝥥𝪦'],
        'だ': ['𝣷𝪞𝥥𝪦'], 'ぢ': ['𝢖𝪜𝥥𝪦'], 'づ': ['𝢳𝪜𝥥𝪦'], 'で': ['𝡌𝪜𝥥𝪦'], 'ど': ['𝠕𝥥𝪦'],
        'ば': ['𝠕𝪞𝥥𝪦'], 'び': ['𝠀𝪜𝥥𝪦'], 'ぶ': ['𝣰𝪟𝪡𝥥𝪦'], 'べ': ['𝢚𝪟𝥥𝪦'], 'ぼ': ['𝢀𝪝𝥥𝪦'],
        'ぱ': ['𝤪', '𝠕𝪞'], 'ぴ': ['𝤪', '𝠀𝪜'], 'ぷ': ['𝤪', '𝣰𝪟𝪡'], 'ぺ': ['𝤪', '𝢚𝪟'], 'ぽ': ['𝤪', '𝢀𝪝'],
        'ー': ['𝥥𝪤'],
        '0': ['𝠊𝪛'], '1': ['𝠀𝪜'], '2': ['𝠎𝪜'], '3': ['𝢆𝪜'], '4': ['𝡄𝪜'],
        '5': ['𝣷𝪜'], '6': ['𝣜𝪢'], '7': ['𝠞𝪢'], '8': ['𝢎𝪢'], '9': ['𝡝𝪢'],
        ' ': ['\u00A0']
    },
    jslDigraph: {
        'きゃ': ['𝣮𝪜𝪦', '𝥥𝪤', '𝢚𝪜'], 'きゅ': ['𝣮𝪜𝪦', '𝥥𝪤', '𝢌'], 'きょ': ['𝣮𝪜𝪦', '𝥥𝪤', '𝡄𝪢'],
        'しゃ': ['𝠞𝪢', '𝥥𝪤', '𝢚𝪜'], 'しゅ': ['𝠞𝪢', '𝥥𝪤', '𝢌'], 'しょ': ['𝠞𝪢', '𝥥𝪤', '𝡄𝪢'],
        'ちゃ': ['𝢖𝪜', '𝥥𝪤', '𝢚𝪜'], 'ちゅ': ['𝢖𝪜', '𝥥𝪤', '𝢌'], 'ちょ': ['𝢖𝪜', '𝥥𝪤', '𝡄𝪢'],
        'にゃ': ['𝠎𝪢', '𝥥𝪤', '𝢚𝪜'], 'にゅ': ['𝠎𝪢', '𝥥𝪤', '𝢌'], 'にょ': ['𝠎𝪢', '𝥥𝪤', '𝡄𝪢'],
        'ひゃ': ['𝠀𝪜', '𝥥𝪤', '𝢚𝪜'], 'ひゅ': ['𝠀𝪜', '𝥥𝪤', '𝢌'], 'ひょ': ['𝠀𝪜', '𝥥𝪤', '𝡄𝪢'],
        'みゃ': ['𝢌𝪢', '𝥥𝪤', '𝢚𝪜'], 'みゅ': ['𝢌𝪢', '𝥥𝪤', '𝢌'], 'みょ': ['𝢌𝪢', '𝥥𝪤', '𝡄𝪢'],
        'りゃ': ['𝦢𝪬', '𝠎𝪞', '𝥥𝪤', '𝢚𝪜'], 'りゅ': ['𝦢𝪬', '𝠎𝪞', '𝥥𝪤', '𝢌'],
        'りょ': ['𝦢𝪬', '𝠎𝪞', '𝥥𝪤', '𝡄𝪢'],
        'ぎゃ': ['𝣮𝪜𝪦𝥥𝪦', '𝥥𝪤', '𝢚𝪜'], 'ぎゅ': ['𝣮𝪜𝪦𝥥𝪦', '𝥥𝪤', '𝢌'],
        'ぎょ': ['𝣮𝪜𝪦𝥥𝪦', '𝥥𝪤', '𝡄𝪢'],
        'じゃ': ['𝠞𝪢𝥥𝪦', '𝥥𝪤', '𝢚𝪜'], 'じゅ': ['𝠞𝪢𝥥𝪦', '𝥥𝪤', '𝢌'],
        'じょ': ['𝠞𝪢𝥥𝪦', '𝥥𝪤', '𝡄𝪢'],
        'ぴゃ': ['𝤪', '𝠀𝪜', '𝥥𝪤', '𝢚𝪜'], 'ぴゅ': ['𝤪', '𝠀𝪜', '𝥥𝪤', '𝢌'],
        'ぴょ': ['𝤪', '𝠀𝪜', '𝥥𝪤', '𝡄𝪢']
    },
    tokenize: function(text) {
        var out = [], i = 0;
        while (i < text.length) {
            if (i + 1 < text.length && this.jslDigraph[text[i] + text[i + 1]]) {
                out.push(this.jslDigraph[text[i] + text[i + 1]]); i += 2;
            } else {
                out.push(this.jslMap[text[i]] || [text[i]]); i++;
            }
        }
        return out;
    },
    func: function(text, options) {
        var layout = (options && options.layout) || 'horizontal';
        if (layout === 'vertical') {
            var words = text.split(/\s+/), wb = [];
            for (var w = 0; w < words.length; w++) {
                var tok = this.tokenize(words[w]), cb = [];
                for (var t = 0; t < tok.length; t++) cb.push(tok[t].join('\n'));
                wb.push(cb.join('\n\n'));
            }
            return wb.join('\n\n\n');
        }
        var tokens = this.tokenize(text), maxH = 1;
        for (var t = 0; t < tokens.length; t++) if (tokens[t].length > maxH) maxH = tokens[t].length;
        var lanes = [];
        for (var r = 0; r < maxH; r++) lanes.push([]);
        for (var t = 0; t < tokens.length; t++) {
            var pad = maxH - tokens[t].length, padded = [];
            for (var p = 0; p < pad; p++) padded.push('');
            for (var p = 0; p < tokens[t].length; p++) padded.push(tokens[t][p]);
            for (var r = 0; r < maxH; r++) lanes[r].push(padded[r] || this.NBSP);
        }
        return lanes.map(function(l) { return l.join('\u2001'); }).join('\n');
    },
    preview: function(text) {
        if (!text) return '[JSL SignWriting]';
        return this.func(text.slice(0, 5));
    }
});
