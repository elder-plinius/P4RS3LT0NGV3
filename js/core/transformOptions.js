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

/**
 * Resolve merged options for a transform by display name (same prefs as Transform tab).
 * @param {string} transformName
 * @param {Array<Object>} [vueTransforms] - Vue copy of transforms (may omit configurableOptions)
 * @returns {Object}
 */
function getMergedTransformOptionsForName(transformName, vueTransforms) {
    if (!transformName) {
        return {};
    }
    let t = null;
    if (Array.isArray(vueTransforms) && vueTransforms.length) {
        t = vueTransforms.find(function(tr) {
            return tr && tr.name === transformName;
        });
    }
    if ((!t || !t.configurableOptions || !t.configurableOptions.length) && typeof window !== 'undefined' && window.transforms) {
        const full = Object.values(window.transforms).find(function(tr) {
            return tr && tr.name === transformName;
        });
        if (full) {
            t = full;
        }
    }
    if (!t || !t.configurableOptions || !t.configurableOptions.length) {
        return {};
    }
    return getMergedTransformOptions(t);
}

if (typeof window !== 'undefined') {
    window.getMergedTransformOptions = getMergedTransformOptions;
    window.getMergedTransformOptionsForName = getMergedTransformOptionsForName;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getMergedTransformOptions, getMergedTransformOptionsForName };
}
