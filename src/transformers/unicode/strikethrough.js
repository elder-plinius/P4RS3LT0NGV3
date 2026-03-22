// strikethrough transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({

        name: 'Strikethrough',
    priority: 85,
    func: function(text) {
            // Use proper Unicode combining characters for strikethrough
            const segments = window.EmojiUtils.splitEmojis(text);
            return segments.map(c => c + '\u0336').join('');
        },
        preview: function(text) {
            if (!text) return '[hieroglyphics]';
            return this.func(text.slice(0, 3)) + '...';
        },
        reverse: function(text) {
            // Remove combining strikethrough characters
            return text.replace(/\u0336/g, '');
        },
        detector: function(text) {
            // Check for combining strikethrough character (U+0336)
            return /\u0336/.test(text);
        }

});