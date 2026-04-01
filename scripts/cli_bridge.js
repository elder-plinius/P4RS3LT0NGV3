#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.join(__dirname, '..');
const transformsRoot = path.join(projectRoot, 'src', 'transformers');
const transforms = require(path.join(projectRoot, 'src', 'transformers', 'loader-node.js'));

function buildRegistry() {
    const skipFiles = new Set(['BaseTransformer.js', 'index.js', 'loader-node.js', 'README.md']);
    const categories = fs.readdirSync(transformsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

    const registry = [];
    for (const category of categories) {
        const categoryPath = path.join(transformsRoot, category);
        const files = fs.readdirSync(categoryPath)
            .filter((file) => file.endsWith('.js') && !skipFiles.has(file))
            .sort();

        for (const file of files) {
            const key = file.replace('.js', '').replace(/-/g, '_');
            const transform = transforms[key];
            if (!transform) {
                continue;
            }

            registry.push({
                key,
                category,
                name: transform.name,
                priority: transform.priority ?? 0,
                canDecode: Boolean(transform.reverse),
                description: transform.description || '',
                inputKind: transform.inputKind || 'textarea',
                configurableOptions: (transform.configurableOptions || []).map((opt) => ({
                    id: opt.id,
                    label: opt.label,
                    type: opt.type,
                    default: opt.default,
                    min: opt.min,
                    max: opt.max,
                    step: opt.step,
                    options: opt.options || undefined
                }))
            });
        }
    }

    return registry;
}

function getDefaultOptions(transform) {
    if (!transform || !transform.configurableOptions || !transform.configurableOptions.length) {
        return {};
    }

    const defaults = {};
    for (const opt of transform.configurableOptions) {
        let value = opt.default;
        if (value === undefined || value === null) {
            if (opt.type === 'boolean') {
                value = false;
            } else if (opt.type === 'select' && opt.options && opt.options.length) {
                value = opt.options[0].value;
            } else if (opt.type === 'number') {
                value = 0;
            } else {
                value = '';
            }
        }
        defaults[opt.id] = value;
    }

    return defaults;
}

function loadUniversalDecoder() {
    const transformOptionsCode = fs.readFileSync(path.join(projectRoot, 'js', 'core', 'transformOptions.js'), 'utf8');
    const decoderCode = fs.readFileSync(path.join(projectRoot, 'js', 'core', 'decoder.js'), 'utf8');
    const emojiWordMapCode = fs.readFileSync(path.join(projectRoot, 'src', 'emojiWordMap.js'), 'utf8');
    const emojiUtilsCode = fs.readFileSync(path.join(projectRoot, 'js', 'utils', 'emoji.js'), 'utf8');

    const mockSteganography = {
        hasEmojiInText: () => false,
        decodeEmoji: () => null,
        decodeInvisible: () => null
    };

    const sandbox = {
        window: {
            transforms,
            steganography: mockSteganography,
            emojiLibrary: {},
            emojiKeywords: {},
            emojiData: {}
        },
        console,
        TextEncoder,
        TextDecoder,
        Intl,
        btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
        atob: (str) => Buffer.from(str, 'base64').toString('binary')
    };

    vm.createContext(sandbox);
    vm.runInContext(emojiUtilsCode, sandbox);
    vm.runInContext(emojiWordMapCode, sandbox);
    vm.runInContext(transformOptionsCode, sandbox);
    vm.runInContext(decoderCode, sandbox);

    return sandbox.universalDecode;
}

function normalizeError(error) {
    if (error && typeof error.message === 'string') {
        return error.message;
    }
    return String(error);
}

function readPayload() {
    const raw = fs.readFileSync(0, 'utf8');
    return raw ? JSON.parse(raw) : {};
}

function writeResult(result, exitCode = 0) {
    process.stdout.write(`${JSON.stringify(result)}\n`);
    process.exit(exitCode);
}

function main() {
    const payload = readPayload();
    const command = payload.command;
    const registry = buildRegistry();

    if (command === 'list') {
        writeResult({ ok: true, transforms: registry });
    }

    const transformKey = payload.transform;
    const transform = transformKey ? transforms[transformKey] : null;

    if (command === 'inspect') {
        if (!transform || !transformKey) {
            writeResult({ ok: false, error: `Unknown transform: ${transformKey}` }, 1);
        }

        const meta = registry.find((entry) => entry.key === transformKey);
        writeResult({
            ok: true,
            transform: {
                ...meta,
                defaultOptions: getDefaultOptions(transform)
            }
        });
    }

    if (command === 'run') {
        if (!transform || !transformKey) {
            writeResult({ ok: false, error: `Unknown transform: ${transformKey}` }, 1);
        }

        const action = payload.action || 'encode';
        const text = payload.text || '';
        const options = {
            ...getDefaultOptions(transform),
            ...(payload.options || {})
        };

        try {
            let output;
            if (action === 'encode') {
                output = transform.func(text, options);
            } else if (action === 'decode') {
                if (!transform.reverse) {
                    throw new Error(`${transform.name} does not support decode`);
                }
                output = transform.reverse(text, options);
            } else if (action === 'preview') {
                output = transform.preview(text, options);
            } else {
                throw new Error(`Unsupported action: ${action}`);
            }

            writeResult({
                ok: true,
                action,
                transform: transformKey,
                name: transform.name,
                options,
                output
            });
        } catch (error) {
            writeResult({ ok: false, error: normalizeError(error) }, 1);
        }
    }

    if (command === 'auto-decode') {
        const decode = loadUniversalDecoder();
        try {
            const result = decode(payload.text || '', {});
            writeResult({ ok: true, result });
        } catch (error) {
            writeResult({ ok: false, error: normalizeError(error) }, 1);
        }
    }

    writeResult({ ok: false, error: `Unknown command: ${command}` }, 1);
}

main();

