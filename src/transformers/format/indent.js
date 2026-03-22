// indent transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Indent',
    priority: 100,
    category: 'format',
    spaces: 4, // Default indent spaces (fallback when options omitted)
    configurableOptions: [
        {
            id: 'spaces',
            label: 'Spaces per indent',
            type: 'number',
            default: 4,
            min: 1,
            max: 32,
            step: 1
        }
    ],
    func: function(text, options) {
        options = options || {};
        let s = options.spaces !== undefined && options.spaces !== ''
            ? parseInt(options.spaces, 10)
            : parseInt(this.spaces, 10) || 4;
        if (Number.isNaN(s) || s < 1) {
            s = 4;
        }
        const indent = ' '.repeat(s);
        
        return text.split('\n').map(line => indent + line).join('\n');
    },
    reverse: function(text) {
        // Remove leading spaces from each line
        return text.split('\n').map(line => line.replace(/^\s+/, '')).join('\n');
    },
    preview: function(text, options) {
        if (!text) return '[indent]';
        return this.func(text.slice(0, 20), options);
    },
    detector: function(text) {
        // Check if all lines start with same amount of whitespace
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length < 2) return false;
        
        const leadingSpaces = lines.map(line => line.match(/^\s*/)[0].length);
        const allSame = leadingSpaces.every(count => count === leadingSpaces[0]);
        
        return allSame && leadingSpaces[0] > 0;
    }
});

