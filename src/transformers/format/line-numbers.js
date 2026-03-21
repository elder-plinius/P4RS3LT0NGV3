// line numbering transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Line Numbers',
    priority: 100,
    category: 'format',
    start: 1, // Starting line number
    func: function(text) {
        const start = parseInt(this.start) || 1;
        const lines = text.split('\n');
        let result = '';
        
        for (let i = 0; i < lines.length; i++) {
            const lineNum = start + i;
            result += lineNum.toString().padStart(4, ' ') + ': ' + lines[i] + '\n';
        }
        
        return result.trimEnd();
    },
    reverse: function(text) {
        // Remove line numbers (format: "   1: text" or "1: text")
        return text.split('\n').map(line => {
            return line.replace(/^\s*\d+\s*:\s*/, '');
        }).join('\n');
    },
    preview: function(text) {
        if (!text) return '[line-numbers]';
        return this.func(text.slice(0, 30));
    },
    detector: function(text) {
        // Check for line number pattern at start of lines
        const lines = text.split('\n');
        if (lines.length < 2) return false;
        
        const hasLineNumbers = lines.filter(line => /^\s*\d+\s*:/.test(line)).length;
        return hasLineNumbers / lines.length > 0.7;
    }
});

