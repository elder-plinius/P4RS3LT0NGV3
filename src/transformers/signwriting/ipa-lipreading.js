// IPA Lip-Reading SignWriting transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'IPA Lip-Reading',
    priority: 0,
    canDecode: false,
    description: 'Converts IPA phonetic text to SignWriting lip-reading mouth shapes (ISWA 2010 head/face symbols).',

    HEAD: '𝧿', EYE: '𝨔',

    ipaToSw: {
        'p': '𝩓𝨵', 'b': '𝩓𝨮', 'm': '𝩓𝨳',
        'ɓ': '𝩓𝨮', 'ʙ': '𝩓𝨮', 'ɸ': '𝩓𝨵𝪛', 'β': '𝩓𝨮',
        'f': '𝩥𝨵', 'v': '𝩥𝨮', 'ʋ': '𝩥𝨮', 'ɱ': '𝩥𝨳',
        'θ': '𝩛𝨵', 'ð': '𝩛𝨮',
        't': '𝩜𝨵', 'd': '𝩜𝨮', 'n': '𝩜𝨳',
        's': '𝩀𝨵𝪛', 'z': '𝩀𝨮', 'l': '𝩜𝪤', 'r': '𝩟', 'ɾ': '𝩟', 'ɹ': '𝩟', 'ɻ': '𝩟',
        'ʃ': '𝩍𝨵𝪛', 'ʒ': '𝩍𝨮',
        'c': '𝩀𝨵', 'ɟ': '𝩀𝨮', 'ɲ': '𝩀𝨳', 'ç': '𝩀𝨵𝪛', 'ʝ': '𝩀𝨮', 'j': '𝩀', 'ʎ': '𝩀',
        'k': '𝩄𝨵', 'g': '𝩄𝨮', 'ŋ': '𝩄𝨳', 'x': '𝩄𝨵𝪛', 'ɣ': '𝩄𝨮', 'w': '𝩆', 'ʍ': '𝩆',
        'q': '𝩉𝨵', 'ɢ': '𝩉𝨮', 'ɴ': '𝩉𝨳', 'χ': '𝩉𝨵𝪛', 'ʁ': '𝩉𝨮', 'ʀ': '𝩉𝨮',
        'ʕ': '𝩌𝨮', 'ħ': '𝩌𝨮', 'ʔ': '𝩡', 'h': '𝩄𝨵𝪛', 'ɦ': '𝩄𝨵𝪛',
        'i': '𝩀', 'y': '𝩆', 'ɨ': '𝩀', 'ʉ': '𝩆', 'ɯ': '𝩐', 'u': '𝩆',
        'ɪ': '𝩊', 'ʏ': '𝩇', 'ʊ': '𝩇',
        'e': '𝩊', 'ø': '𝩇', 'ɘ': '𝩊', 'ɵ': '𝩇', 'ɤ': '𝩊', 'o': '𝩇', 'ə': '𝩊', 'ɚ': '𝩊',
        'ɛ': '𝩈', 'œ': '𝩈', 'ɜ': '𝩈', 'ɞ': '𝩈', 'ʌ': '𝩉', 'ɔ': '𝩉',
        'a': '𝩌', 'ɶ': '𝩌', 'ä': '𝩌', 'ɑ': '𝩌', 'ɒ': '𝩌', 'æ': '𝩌', 'ɐ': '𝩌',
        'ʘ': '𝩓𝨶', 'ǀ': '𝩣𝨶', 'ǃ': '𝩡𝨶', 'ǂ': '𝩡𝨶', 'ǁ': '𝩡𝨶'
    },

    diphthongs: {
        'aɪ': ['𝩌', '𝩀'], 'aʊ': ['𝩌', '𝩆'], 'eɪ': ['𝩊', '𝩀'],
        'oʊ': ['𝩇', '𝩆'], 'ɔɪ': ['𝩉', '𝩀'], 'əʊ': ['𝩊', '𝩆'],
        'ɪə': ['𝩊', '𝩊'], 'eə': ['𝩊', '𝩌'], 'ʊə': ['𝩇', '𝩊']
    },

    skipChars: { 'ˈ': 1, 'ˌ': 1, 'ː': 1, ' ': 1, '\t': 1, '\n': 1 },

    func: function(text) {
        var result = [], i = 0, HEAD = this.HEAD, EYE = this.EYE;
        while (i < text.length) {
            if (this.skipChars[text[i]]) { i++; continue; }
            // Check diphthongs (2-char)
            if (i + 1 < text.length) {
                var di = text[i] + text[i + 1];
                if (this.diphthongs[di]) {
                    var shapes = this.diphthongs[di];
                    for (var s = 0; s < shapes.length; s++) {
                        result.push(HEAD + EYE + shapes[s]);
                        if (s < shapes.length - 1) result.push('\u2192');
                    }
                    i += 2; continue;
                }
            }
            var ch = text[i]; i++;
            if (this.ipaToSw[ch]) {
                result.push(HEAD + EYE + this.ipaToSw[ch]);
            } else {
                result.push(HEAD + EYE + '𝨻');
            }
        }
        return result.join(' ');
    },

    preview: function(text) {
        if (!text) return '[IPA Lip-Reading]';
        return this.func(text.slice(0, 8));
    }
});
