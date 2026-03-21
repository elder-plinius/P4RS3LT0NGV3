// line numbering transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Line Numbers',
    priority: 100,
    category: 'format',
    start: 1, // Starting line number (fallback when options omitted)
    gutterWidth: 4, // padStart width for the number column
    configurableOptions: [
        {
            id: 'start',
            label: 'Starting line number',
            type: 'number',
            default: 1,
            min: 0,
            max: 9999999,
            step: 1
        },
        {
            id: 'gutterWidth',
            label: 'Number column width',
            type: 'number',
            default: 4,
            min: 1,
            max: 12,
            step: 1
        }
    ],
    func: function(text, options) {
        options = options || {};
        let start = options.start !== undefined && options.start !== ''
            ? parseInt(options.start, 10)
            : parseInt(this.start, 10) || 1;
        if (Number.isNaN(start)) {
            start = 1;
        }
        let gutterWidth = options.gutterWidth !== undefined && options.gutterWidth !== ''
            ? parseInt(options.gutterWidth, 10)
            : parseInt(this.gutterWidth, 10) || 4;
        if (Number.isNaN(gutterWidth) || gutterWidth < 1) {
            gutterWidth = 4;
        }
        const lines = text.split('\n');
        let result = '';
        
        for (let i = 0; i < lines.length; i++) {
            const lineNum = start + i;
            result += lineNum.toString().padStart(gutterWidth, ' ') + ': ' + lines[i] + '\n';
        }
        
        return result.trimEnd();
    },
    reverse: function(text) {
        // Remove line numbers (format: "   1: text" or "1: text")
        return text.split('\n').map(line => {
            return line.replace(/^\s*\d+\s*:\s*/, '');
        }).join('\n');
    },
    preview: function(text, options) {
        if (!text) return '[line-numbers]';
        return this.func(text.slice(0, 30), options);
    },
    detector: function(text) {
        // Check for line number pattern at start of lines
        const lines = text.split('\n');
        if (lines.length < 2) return false;
        
        const hasLineNumbers = lines.filter(line => /^\s*\d+\s*:/.test(line)).length;
        return hasLineNumbers / lines.length > 0.7;
    }
});

