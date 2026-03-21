// remove accents/diacritics transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Remove Accents',
    priority: 50,
    category: 'format',
    map: {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ý': 'y', 'ÿ': 'y',
        'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
        'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
        'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
        'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
        'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
        'Ý': 'Y', 'Ÿ': 'Y',
        'ç': 'c', 'Ç': 'C',
        'ñ': 'n', 'Ñ': 'N',
        'ß': 'ss', 'ẞ': 'SS'
    },
    func: function(text) {
        return [...text].map(c => {
            // Check map first
            if (this.map[c]) return this.map[c];
            // Use Unicode normalization to remove combining diacritics
            return c.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }).join('');
    },
    reverse: function(text) {
        // Cannot reverse - accents are lost
        return text;
    },
    preview: function(text) {
        if (!text) return '[no-accents]';
        return this.func(text.slice(0, 10));
    },
    canDecode: false,
    detector: function(text) {
        // Check if text has no accented characters
        const normalized = text.normalize('NFD');
        return !/[\u0300-\u036f]/.test(normalized) && /[àáâãäåèéêëìíîïòóôõöùúûüýÿçñßÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸÇÑẞ]/.test(text);
    }
});

