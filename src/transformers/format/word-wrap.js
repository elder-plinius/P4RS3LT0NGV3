// word wrap transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Word Wrap',
    priority: 100,
    category: 'format',
    width: 80, // Default wrap width
    func: function(text) {
        const width = parseInt(this.width) || 80;
        if (width < 1) return text;
        
        const lines = text.split('\n');
        let result = '';
        
        for (const line of lines) {
            if (line.length <= width) {
                result += line + '\n';
                continue;
            }
            
            // Word wrap: break at word boundaries
            let currentLine = '';
            const words = line.split(/(\s+)/);
            
            for (const word of words) {
                if ((currentLine + word).length <= width) {
                    currentLine += word;
                } else {
                    if (currentLine) {
                        result += currentLine.trim() + '\n';
                    }
                    currentLine = word;
                }
            }
            
            if (currentLine) {
                result += currentLine.trim() + '\n';
            }
        }
        
        return result.trimEnd();
    },
    reverse: function(text) {
        // Remove line breaks (simple approach - may not be perfect)
        return text.replace(/\n/g, ' ');
    },
    preview: function(text) {
        if (!text) return '[word-wrap]';
        return this.func(text.slice(0, 50));
    },
    detector: function(text) {
        // Check if text has consistent line lengths
        const lines = text.split('\n');
        if (lines.length < 2) return false;
        
        const lengths = lines.map(l => l.length);
        const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
        
        // Low variance suggests word wrapping
        return variance < 100 && avgLength > 40 && avgLength < 120;
    }
});

