function universalDecode(input, context = {}) {
    if (!input) return null;
    
    const allDecodings = [];
    const { activeTab, activeTransform } = context;
    
    function addDecoding(text, method, priority = 20) {
        if (text && text !== input && text.length > 0) {
            const exists = allDecodings.some(d => d.text === text);
            if (!exists) {
                allDecodings.push({ text, method, priority });
            }
        }
    }
    
    let foundHighPriorityMatch = false;
    for (const [transformKey, transform] of Object.entries(window.transforms)) {
        if (transform.detector && transform.reverse) {
            try {
                if (transform.detector(input)) {
                    const result = transform.reverse(input);
                    if (result && result !== input && result.length > 0) {
                        const hasContent = result.replace(/[\x00-\x1F\x7F-\x9F\s]/g, '').length > 0;
                        if (hasContent) {
                            const detectorPriority = transform.priority || 285;
                            addDecoding(result, transform.name, detectorPriority);
                            if (detectorPriority >= 280) {
                                foundHighPriorityMatch = true;
                            }
                        }
                    }
                }
            } catch (e) {
                console.debug('Error in transform detector:', e);
            }
        }
    }
    
    // Continue processing to collect all decodings, even if high-priority matches are found
    // This ensures alternatives are shown
    
    if (window.steganography && window.steganography.hasEmojiInText && window.steganography.hasEmojiInText(input)) {
        try {
            const decoded = window.steganography.decodeEmoji(input);
            if (decoded) {
                addDecoding(decoded, 'Emoji Steganography', 100);
            }
        } catch (e) {
            console.debug('Error decoding emoji steganography:', e);
        }
    }
    
    if (activeTab === 'transforms' && activeTransform) {
        try {
            const transformKey = Object.keys(window.transforms).find(
                key => window.transforms[key].name === activeTransform.name
            );
            
            if (transformKey && window.transforms[transformKey].reverse) {
                const result = window.transforms[transformKey].reverse(input);
                if (result && result !== input) {
                    addDecoding(result, activeTransform.name, 150);
                }
            }
        } catch (e) {
            console.error('Error decoding with active transform:', e);
        }
    }
    
    for (const name in window.transforms) {
        const transform = window.transforms[name];
        if (transform.reverse && !transform.detector) {
            try {
                const result = transform.reverse(input);
                if (result !== input && /[a-zA-Z0-9\s]{3,}/.test(result)) {
                    addDecoding(result, transform.name, 10);
                }
            } catch (e) {
                console.error(`Error decoding with ${name}:`, e);
            }
        }
    }

    allDecodings.sort((a, b) => b.priority - a.priority);
    
    if (allDecodings.length === 0) return null;
    
    const primary = allDecodings[0];
    const alternatives = allDecodings.slice(1).map(({ text, method }) => ({ text, method }));
    
    return { text: primary.text, method: primary.method, alternatives };
}