// gray code transform
import BaseTransformer from '../BaseTransformer.js';

export default new BaseTransformer({
    name: 'Gray Code',
    priority: 300,
    category: 'encoding',
    func: function(text) {
        const bytes = new TextEncoder().encode(text);
        const binary = Array.from(bytes)
            .map(b => b.toString(2).padStart(8, '0'))
            .join('');
        
        // Convert to Gray code
        let gray = binary[0];
        for (let i = 1; i < binary.length; i++) {
            gray += (parseInt(binary[i - 1]) ^ parseInt(binary[i])).toString();
        }
        
        return gray;
    },
    reverse: function(text) {
        try {
            // Convert from Gray code to binary
            if (!/^[01]+$/.test(text)) return text;
            
            let binary = text[0];
            for (let i = 1; i < text.length; i++) {
                binary += (parseInt(binary[i - 1]) ^ parseInt(text[i])).toString();
            }
            
            // Convert binary to bytes
            const bytes = [];
            for (let i = 0; i < binary.length; i += 8) {
                const byte = binary.slice(i, i + 8);
                if (byte.length === 8) {
                    bytes.push(parseInt(byte, 2));
                }
            }
            
            return new TextDecoder().decode(new Uint8Array(bytes));
        } catch (e) {
            return text;
        }
    },
    preview: function(text) {
        if (!text) return '[gray]';
        const result = this.func(text.slice(0, 2));
        return result.substring(0, 16) + '...';
    },
    detector: function(text) {
        const cleaned = text.trim().replace(/\s/g, '');
        return cleaned.length >= 8 && /^[01]+$/.test(cleaned);
    }
});

