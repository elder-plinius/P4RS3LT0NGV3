/**
 * Merge configurable option defaults with localStorage (transformOptionPrefs).
 * Shared by the Transform tab, universal decoder, and manual decode.
 */
function getMergedTransformOptions(transform) {
    if (!transform || !transform.configurableOptions || !transform.configurableOptions.length) {
        return {};
    }
    const merged = {};
    transform.configurableOptions.forEach(function(opt) {
        let v = opt.default;
        if (v === undefined || v === null) {
            if (opt.type === 'boolean') {
                v = false;
            } else if (opt.type === 'select' && opt.options && opt.options.length) {
                v = opt.options[0].value;
            } else if (opt.type === 'number') {
                v = 0;
            } else {
                v = '';
            }
        }
        merged[opt.id] = v;
    });
    let saved = {};
    try {
        if (typeof localStorage !== 'undefined' && localStorage.getItem) {
            const raw = localStorage.getItem('transformOptionPrefs');
            if (raw) {
                const all = JSON.parse(raw);
                if (all && typeof all === 'object' && transform.name && all[transform.name]) {
                    saved = all[transform.name];
                }
            }
        }
    } catch (e) {
        /* ignore */
    }
    return Object.assign({}, merged, saved);
}

if (typeof window !== 'undefined') {
    window.getMergedTransformOptions = getMergedTransformOptions;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getMergedTransformOptions };
}
