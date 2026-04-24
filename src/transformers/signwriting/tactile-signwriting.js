// Deafblind Tactile SignWriting transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Tactile SignWriting',
    priority: 0,
    canDecode: false,
    description: 'Deafblind tactile fingerspelling approximation in SignWriting (ISWA 2010). Two-hand layers per letter.',

    tactileMap: {
        'A': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝣷𝪝𝪩𝪆𝪞𝤅'],
        'B': ['𝡌𝪝𝪩𝡶𝪞', '𝡌𝪝𝪩𝪆𝪟𝤅'],
        'C': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝣜𝪝𝪩𝪆𝪟𝪧𝤎𝤻𝪩'],
        'D': ['𝡌𝪝𝪩𝣢𝪟𝪡', '𝠀𝪝𝪩𝪆𝪞𝪆𝪞𝪨𝤅'],
        'E': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝠀𝪝𝪩𝪆𝪞𝤅'],
        'F': ['𝡌𝪝𝪩𝠕𝪟𝪡', '𝠀𝪝𝪩𝪆𝪞𝪩𝤅'],
        'G': ['𝡌𝪝𝪩𝤃𝪞𝪡', '𝡌𝪝𝪩𝪆𝪟𝤅'],
        'H': ['𝡌𝪝𝪩𝡌𝪟𝪡', '𝡌𝪝𝪩𝤎𝥦𝪧'],
        'I': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝣆𝪝𝪧𝪆𝪞𝤅'],
        'J': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝡌𝪝𝪩𝣆𝪝𝪧𝪆𝪞𝤎𝥦𝪣𝪆𝪟𝥸𝪧'],
        'K': ['𝡌𝪝𝪩𝠆𝪝𝪡', '𝠀𝪝𝪩𝪆𝪞𝪩𝤅'],
        'L': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝡌𝪝𝪩𝪆𝪟𝤅'],
        'M': ['𝡌𝪝𝪩𝢌𝪟𝪡', '𝡌𝪝𝪩𝪆𝪟𝤅'],
        'N': ['𝡌𝪝𝪩𝠕𝪟𝪡', '𝡌𝪝𝪩𝪆𝪟𝤅'],
        'O': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝢮𝪝𝪩𝪆𝪞𝤅'],
        'P': ['𝡌𝪝𝪩𝣱𝪟𝪡', '𝠀𝪝𝪩𝪆𝪞𝪢𝤗'],
        'Q': ['𝡌𝪝𝪩𝠆𝪟𝪡', '𝣷𝪝𝪩𝤈𝩾𝪡'],
        'R': ['𝡌𝪝𝪩𝠆𝪞𝪡', '𝡌𝪝𝪩𝪆𝪟𝪫𝤅'],
        'S': ['𝡌𝪝𝪩𝠆𝪟𝪡', '𝢒𝪝𝪩𝤈𝩾𝪡'],
        'T': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝡌𝪝𝪩𝪆𝪟𝪫𝤅'],
        'U': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝢒𝪝𝪩𝪆𝪞𝤅'],
        'V': ['𝡌𝪝𝪩𝠎𝪟𝪡', '𝡌𝪝𝪩𝪆𝪟𝤅'],
        'W': ['𝡌𝪝𝪩𝡎𝪟𝪡', '𝡝𝪝𝪩𝪆𝪟𝪡𝤈'],
        'X': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝠀𝪝𝪩𝪆𝪞𝪩𝤅'],
        'Y': ['𝡌𝪝𝪩𝠀𝪟𝪡', '𝣷𝪝𝪩𝪆𝪟𝪬'],
        'Z': ['𝡌𝪝𝪩𝡚𝪞𝪡', '𝡌𝪝𝪩𝪆𝪟𝤅']
    },

    func: function(text) {
        var upper = text.toUpperCase();
        var blocks = [];
        for (var i = 0; i < upper.length; i++) {
            var ch = upper[i];
            if (ch === ' ') {
                blocks.push('\u00A0\n\u00A0');
                continue;
            }
            var sign = this.tactileMap[ch];
            if (sign) {
                blocks.push(sign[0] + '\n' + sign[1]);
            }
        }
        return blocks.join('\n\n');
    },

    preview: function(text) {
        if (!text) return '[Tactile SignWriting]';
        return this.func(text.slice(0, 3));
    }
});
