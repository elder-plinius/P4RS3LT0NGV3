// indent transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Indent',
    priority: 100,
    category: 'format',
    spaces: 4, // Default indent spaces
    func: function(text) {
        const spaces = parseInt(this.spaces) || 4;
        const indent = ' '.repeat(spaces);
        
        return text.split('\n').map(line => indent + line).join('\n');
    },
    reverse: function(text) {
        // Remove leading spaces from each line
        return text.split('\n').map(line => line.replace(/^\s+/, '')).join('\n');
    },
    preview: function(text) {
        if (!text) return '[indent]';
        return this.func(text.slice(0, 20));
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

