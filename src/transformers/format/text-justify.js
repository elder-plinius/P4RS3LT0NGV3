// text justification transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Text Justify',
    priority: 100,
    category: 'format',
    width: 80, // Default width (fallback when options omitted)
    align: 'left', // left, right, center
    configurableOptions: [
        {
            id: 'width',
            label: 'Line width (characters)',
            type: 'number',
            default: 80,
            min: 8,
            max: 200,
            step: 1
        },
        {
            id: 'align',
            label: 'Alignment',
            type: 'select',
            default: 'left',
            options: [
                { value: 'left', label: 'Left (pad on the right)' },
                { value: 'right', label: 'Right (pad on the left)' },
                { value: 'center', label: 'Center' }
            ]
        }
    ],
    func: function(text, options) {
        options = options || {};
        let w = options.width !== undefined && options.width !== ''
            ? parseInt(options.width, 10)
            : parseInt(this.width, 10) || 80;
        if (Number.isNaN(w) || w < 1) {
            w = 80;
        }
        const width = w;
        const align = options.align !== undefined && options.align !== ''
            ? options.align
            : (this.align || 'left');
        
        const lines = text.split('\n');
        let result = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) {
                result += '\n';
                continue;
            }
            
            if (trimmed.length >= width) {
                result += trimmed + '\n';
                continue;
            }
            
            let justified = '';
            if (align === 'left') {
                justified = trimmed.padEnd(width);
            } else if (align === 'right') {
                justified = trimmed.padStart(width);
            } else if (align === 'center') {
                const padding = Math.floor((width - trimmed.length) / 2);
                justified = ' '.repeat(padding) + trimmed + ' '.repeat(width - trimmed.length - padding);
            } else {
                justified = trimmed;
            }
            
            result += justified + '\n';
        }
        
        return result.trimEnd();
    },
    reverse: function(text) {
        // Remove padding spaces
        return text.split('\n').map(line => line.trim()).join('\n');
    },
    preview: function(text, options) {
        if (!text) return '[text-justify]';
        return this.func(text.slice(0, 20), options);
    },
    detector: function(text) {
        // Check for consistent line lengths with padding
        const lines = text.split('\n');
        if (lines.length < 2) return false;
        
        const lengths = lines.map(l => l.length);
        const allSameLength = lengths.every(len => len === lengths[0]);
        const hasLeadingTrailingSpaces = lines.some(line => /^\s+|\s+$/.test(line));
        
        return allSameLength && hasLeadingTrailingSpaces && lengths[0] > 40;
    }
});

