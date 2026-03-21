// boustrophedon writing transform (alternating direction)
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Boustrophedon',
    priority: 50,
    category: 'format',
    func: function(text) {
        const lines = text.split(/\r?\n/);
        return lines.map((line, index) => {
            // Alternate direction: even lines left-to-right, odd lines right-to-left
            if (index % 2 === 0) {
                return line;
            } else {
                return line.split('').reverse().join('');
            }
        }).join('\n');
    },
    reverse: function(text) {
        // Same function - boustrophedon is self-reciprocal
        return this.func(text);
    },
    preview: function(text) {
        if (!text) return '[boustrophedon]';
        const lines = text.split(/\r?\n/);
        if (lines.length === 0) return '';
        return this.func(lines.slice(0, 2).join('\n'));
    },
    detector: function(text) {
        // Hard to detect - would need line analysis
        return false;
    }
});

