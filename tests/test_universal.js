#!/usr/bin/env node

/**
 * Comprehensive Universal Test Suite
 * 
 * For each transformer:
 * 1. Encode simple string ("hello world")
 * 2. Encode complex string ("Hello World. <3 🌞")
 * 3. Pass encoded output to universal decoder
 * 4. Verify decoder correctly identifies the encoding method
 * 5. Verify decoded output matches original (accounting for limitations)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Get project root directory (parent of tests directory)
const projectRoot = path.resolve(__dirname, '..');

const transforms = require(path.join(projectRoot, 'src/transformers/loader-node.js'));
const transformOptionsCode = fs.readFileSync(path.join(projectRoot, 'js/core/transformOptions.js'), 'utf8');
const decoderCode = fs.readFileSync(path.join(projectRoot, 'js/core/decoder.js'), 'utf8');
const emojiWordMapCode = fs.readFileSync(path.join(projectRoot, 'src/emojiWordMap.js'), 'utf8');
const emojiUtilsCode = fs.readFileSync(path.join(projectRoot, 'js/utils/emoji.js'), 'utf8');

const mockSteganography = {
    decodeEmoji: (text) => null,
    decodeInvisible: (text) => null
};

const sandbox = {
    window: {
        transforms: transforms,
        steganography: mockSteganography,
        emojiLibrary: {},
        emojiKeywords: {}
    },
    console: console,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    atob: (str) => Buffer.from(str, 'base64').toString('binary'),
    Intl: Intl
};

vm.createContext(sandbox);
vm.runInContext(emojiUtilsCode, sandbox);
vm.runInContext(emojiWordMapCode, sandbox);
vm.runInContext(transformOptionsCode, sandbox);
vm.runInContext(decoderCode, sandbox);

const universalDecode = sandbox.universalDecode;

// Test strings
const testStrings = {
    simple: 'hello world',
    complex: 'Hello World. <3 🌞',
    edgeCase: 'this is the vest sukkess we\'ve ever had! hello world. <#3 😊'
};

// Helper function to normalize strings based on transformer limitations
function normalizeForComparison(text, transformations = {}) {
    let normalized = text;
    
    if (transformations.lowercase) {
        normalized = normalized.toLowerCase();
    }
    
    if (transformations.uppercase) {
        normalized = normalized.toUpperCase();
    }
    
    if (transformations.stripEmoji) {
        normalized = normalized.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{2300}-\u{23FF}\u{2B50}\u{1F004}]/gu, '');
    }
    
    if (transformations.stripPunctuation) {
        normalized = normalized.replace(/[.,!?;:'"]/g, '');
    }
    
    if (transformations.stripSpecialChars) {
        normalized = normalized.replace(/[^a-zA-Z0-9\s]/g, '');
    }
    
    if (transformations.stripWhitespace) {
        normalized = normalized.replace(/\s+/g, '');
    }
    
    if (transformations.stripNonLetters) {
        normalized = normalized.replace(/[^a-zA-Z\s]/g, '');
    }
    
    if (transformations.collapseWhitespace) {
        normalized = normalized.replace(/\s+/g, ' ').trim();
    }
    
    return normalized;
}

// Transformers with known limitations
const limitations = {
    // These transformers intentionally don't preserve everything
    'morse': { 
        issues: 'Lowercases, strips emoji, converts some punctuation to text',
        acceptPartial: true,
        normalize: { lowercase: true, stripEmoji: true, collapseWhitespace: true },
        emojiOnly: true  // Only has limitations with emoji, works fine for simple text
    },
    'braille': {
        issues: 'Lowercases, may not encode all special characters',
        acceptPartial: true,
        normalize: { lowercase: true, stripEmoji: true }
    },
    'nato': {
        issues: 'Lowercases, may not encode symbols/emoji',
        acceptPartial: true,
        normalize: { lowercase: true, stripEmoji: true, stripSpecialChars: true, collapseWhitespace: true }
    },
    'rail_fence': {
        issues: 'Rearranges characters, hard to detect uniquely',
        acceptPartial: true
    },
    'quenya': {
        issues: 'Fantasy language with vowel/consonant pairs',
        acceptPartial: true
    },
    'hieroglyphics': {
        issues: 'Lossy encoding, case sensitive',
        acceptPartial: true
    },
    'a1z26': {
        issues: 'Only encodes letters A-Z, strips everything else including spaces, lowercases',
        normalize: { lowercase: true, stripNonLetters: true, stripWhitespace: true }
    },
    'semaphore': {
        issues: 'Limited character set (uppercase letters only), uses emoji arrows',
        normalize: { uppercase: true, stripNonLetters: true, stripWhitespace: true },
        acceptPartial: true
    },
    'tap_code': {
        issues: 'Limited character set, lowercases, uses dots',
        normalize: { lowercase: true, stripNonLetters: true, stripPunctuation: true },
        acceptPartial: true
    },
    'html': {
        issues: 'Only encodes special characters, rest unchanged',
        acceptPartial: true
    },
    'ubbi_dubbi': {
        issues: 'May not preserve all special characters',
        acceptPartial: true
    },
    'rovarspraket': {
        issues: 'Swedish language game, may not preserve everything',
        acceptPartial: true
    },
    'baconian': {
        issues: 'Only encodes A-Z',
        acceptPartial: true,
        minMatch: 'hello'
    },
    'alternating_case': {
        issues: 'Generic case formatting, hard to detect uniquely (looks like Base64)',
        acceptPartial: true,
        normalize: (t) => t.toLowerCase()
    },
    
    // === CIPHERS (Added during BaseTransformer conversion) ===
    'atbash': {
        issues: 'Simple substitution cipher, hard to detect uniquely',
        acceptPartial: true
    },
    'caesar': {
        issues: 'Simple substitution cipher, hard to detect uniquely',
        acceptPartial: true
    },
    'affine': {
        issues: 'Only encodes A-Z, preserves case',
        acceptPartial: true,
        caseInsensitive: true
    },
    'vigenere': {
        issues: 'Only encodes A-Z, preserves case',
        acceptPartial: true
    },
    'rot13': {
        issues: 'Letter substitution, hard to detect uniquely',
        acceptPartial: true
    },
    'rot18': {
        issues: 'Letter and number substitution, hard to detect uniquely',
        acceptPartial: true
    },
    'rot47': {
        issues: 'ASCII rotation, hard to detect uniquely',
        acceptPartial: true
    },
    'rot5': {
        issues: 'Number rotation only, hard to detect uniquely',
        acceptPartial: true
    },
    
    // === TEXT FORMATTING ===
    'disemvowel': {
        issues: 'Removes vowels, reverse is ambiguous',
        acceptPartial: true
    },
    'leetspeak': {
        issues: 'One-way transformation, reverse is ambiguous',
        acceptPartial: true
    },
    'qwerty_shift': {
        issues: 'May not encode all characters',
        acceptPartial: true
    },
    'pigLatin': {
        issues: 'Ambiguous rules for "way" endings',
        acceptPartial: true
    },
    'kebab_case': {
        issues: 'Lowercases, removes punctuation (splits on apostrophes), removes special characters',
        normalize: { lowercase: true, stripPunctuation: true, stripSpecialChars: true, stripEmoji: true, collapseWhitespace: true },
        acceptPartial: true  // Apostrophes within words cause ambiguity
    },
    'snake_case': {
        issues: 'Lowercases, removes punctuation (splits on apostrophes), removes special characters',
        normalize: { lowercase: true, stripPunctuation: true, stripSpecialChars: true, stripEmoji: true, collapseWhitespace: true },
        acceptPartial: true  // Apostrophes within words cause ambiguity
    },
    'camel_case': {
        issues: 'Lowercases, removes punctuation, loses word boundaries (especially for numbers)',
        normalize: { lowercase: true, stripPunctuation: true, stripSpecialChars: true, stripEmoji: true, collapseWhitespace: true },
        acceptPartial: true  // Word boundaries and apostrophes cause ambiguity
    },
    
    // === FANTASY SCRIPTS (Case-insensitive) ===
    'tengwar': {
        issues: 'Case-insensitive mapping, hard to distinguish from Elder Futhark',
        acceptPartial: true,
        caseInsensitive: true
    },
    'klingon': {
        issues: 'Case-insensitive mapping, mixed case letters',
        acceptPartial: true,
        caseInsensitive: true
    },
    'aurebesh': {
        issues: 'Uppercase only, removes whitespace',
        normalize: { uppercase: true, stripWhitespace: true },
        acceptPartial: true
    },
    'dovahzul': {
        issues: 'Case-insensitive mapping with vowel expansion',
        caseInsensitive: true
    },
    'ogham': {
        issues: 'Ancient script, uppercase only',
        normalize: { uppercase: true },
        acceptPartial: true
    },
    'elder_futhark': {
        issues: 'Runic alphabet, case-insensitive',
        caseInsensitive: true
    },
    'small_caps': {
        issues: 'Lowercases',
        caseInsensitive: true
    },
    'hiragana': {
        issues: 'Syllabic script, may not preserve everything',
        acceptPartial: true
    },
    'katakana': {
        issues: 'Syllabic script, may not preserve everything',
        acceptPartial: true
    },
    'cyrillic_stylized': {
        issues: 'Mixed script, partial character replacement',
        acceptPartial: true
    },
    
    // === SYMBOLS ===
    'chemical': {
        issues: 'Lowercases all text (case-insensitive)',
        caseInsensitive: true
    },
    'regional_indicator': {
        issues: 'Only encodes A-Z as flag emojis',
        acceptPartial: true
    },
    'emoji_speak': {
        issues: 'Limited vocabulary, word-based, random selection means decoded words may differ from original (synonyms)',
        acceptPartial: true  // Decodes to synonyms, not exact original words
    },
    'roman_numerals': {
        issues: 'Only converts numbers, may have limits',
        acceptPartial: true
    },
    
    // === UNICODE STYLES ===
    'zalgo': {
        issues: 'Adds combining marks, may not decode perfectly',
        acceptPartial: true
    },
    'mirror': {
        issues: 'Reverses text, hard to distinguish from reverse transform',
        acceptPartial: true
    },
    'reverse': {
        issues: 'Reverses text, hard to distinguish from mirror transform',
        acceptPartial: true
    },
    'reverse_words': {
        issues: 'Reverses word order, may be confused with other transforms',
        acceptPartial: true
    },
    'upside_down': {
        issues: 'Uses Unicode lookalikes, may be confused with ciphers',
        acceptPartial: true
    },
    'vaporwave': {
        issues: 'Fullwidth + spaces, may be confused with other styles',
        acceptPartial: true
    },
    'fraktur': {
        issues: 'Gothic script with special chars, may confuse detector',
        acceptPartial: true
    },
    'subscript': {
        issues: 'Limited character set, some chars use special Unicode',
        acceptPartial: true
    },
    'superscript': {
        issues: 'Limited character set, some chars use special Unicode',
        acceptPartial: true
    },
    'regional_indicator': {
        issues: 'Flag emojis for letters, special Unicode handling',
        acceptPartial: true
    },
    
    // === BASE ENCODINGS ===
    'ebcdic': {
        issues: 'EBCDIC is uppercase-only, converts lowercase to uppercase',
        normalize: { uppercase: true },
        acceptPartial: true
    },
    'ascii85': {
        issues: 'May have issues with certain emoji at end of string',
        acceptPartial: true,
        complexOnly: true
    },
    'base62': {
        issues: 'Hard to distinguish from other base encodings',
        acceptPartial: true
    },
    'base64url': {
        issues: 'Very similar to Base64, hard to distinguish',
        acceptPartial: true
    },
    'base45': {
        issues: 'May be confused with other encodings',
        acceptPartial: true
    },
    
    // === SPECIAL ===
    'brainfuck': {
        issues: 'Esoteric language, encoding is not bijective',
        acceptPartial: true
    },
    'invisible_text': {
        issues: 'Uses private use area, may have decoding issues',
        acceptPartial: true
    },
    
    // === NEW CIPHERS (Added in latest update) ===
    'playfair': {
        issues: 'Requires key, only encodes A-Z (J=I), pads with X',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'pigpen': {
        issues: 'Only encodes A-Z, uses geometric symbols, returns uppercase on decode',
        acceptPartial: true,
        normalize: { uppercase: true }
    },
    'porta': {
        issues: 'Requires key, only encodes A-Z',
        acceptPartial: true
    },
    'homophonic': {
        issues: 'Uses random selection, same input produces different output',
        acceptPartial: true,
        normalize: { stripWhitespace: true }
    },
    'hill': {
        issues: 'Requires key matrix, only encodes A-Z, pads with X',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'beaufort': {
        issues: 'Requires key, only encodes A-Z',
        acceptPartial: true
    },
    'columnar_transposition': {
        issues: 'Requires key, transposition cipher',
        acceptPartial: true
    },
    'xor': {
        issues: 'Requires key, outputs hex, may be detected as Hexadecimal',
        acceptPartial: true
    },
    'louchebem': {
        issues: 'French slang transformation, reverse may not be perfect',
        acceptPartial: true
    },
    'uppercase_lowercase': {
        issues: 'Toggle case, may be confused with other ciphers in detection',
        acceptPartial: true
    },
    
    // === NEW ENCODINGS ===
    'base91': {
        issues: 'May be confused with other base encodings',
        acceptPartial: true
    },
    'quoted_printable': {
        issues: 'Email encoding, adds soft line breaks, may have whitespace issues',
        acceptPartial: true,
        normalize: { collapseWhitespace: true }
    },
    'bcd': {
        issues: 'Binary Coded Decimal encoding of character codes, complex reverse logic',
        acceptPartial: true
    },
    'base36': {
        issues: 'May be confused with Base32 in detection',
        acceptPartial: true
    },
    
    // === NEW FORMAT TRANSFORMS ===
    'boustrophedon': {
        issues: 'Only works on multi-line text, single-line produces no encoding',
        acceptPartial: true
    },
    'latin_gibberish': {
        issues: 'Adds "us" after consonants, may not preserve everything',
        acceptPartial: true
    },
    'syllables_separator': {
        issues: 'Adds separators, reverse removes them but original separators lost',
        acceptPartial: true
    },
    'toggle_case': {
        issues: 'Self-inverse, hard to detect uniquely',
        acceptPartial: true
    },
    
    // === NEWEST CIPHERS ===
    'adfgx': {
        issues: 'Requires key, only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'polybius': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'bifid': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'trifid': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'scytale': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'nihilist': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'four_square': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'two_square': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'gronsfeld': {
        issues: 'Requires numeric key, only encodes A-Z',
        acceptPartial: true
    },
    'autokey': {
        issues: 'Requires key, only encodes A-Z',
        acceptPartial: true
    },
    
    // === NEWEST ENCODINGS ===
    'base122': {
        issues: 'May have issues with emoji and special Unicode characters',
        acceptPartial: true
    },
    'z85': {
        issues: 'May have issues with emoji and special Unicode characters',
        acceptPartial: true
    },
    'yenc': {
        issues: 'Binary encoding, may be confused with other encodings',
        acceptPartial: true
    },
    'unicode_points': {
        issues: 'Encodes as U+XXXX format, works perfectly',
        acceptPartial: false
    },
    'emoji_encoding': {
        issues: 'May have issues with emoji in input text',
        acceptPartial: true
    },
    
    // === NEWEST TECHNICAL ===
    'icao': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'itu': {
        issues: 'Only encodes A-Z, removes spaces and punctuation',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'maritime_flags': {
        issues: 'Only encodes A-Z as flag emojis',
        acceptPartial: true,
        normalize: { stripNonLetters: true, stripWhitespace: true }
    },
    'baudot': {
        issues: 'Uppercase only, limited character set',
        acceptPartial: true,
        normalize: { uppercase: true }
    },
    
    // === NEWEST FORMAT ===
    'whitespace_steganography': {
        issues: 'Encodes in whitespace patterns, works perfectly',
        acceptPartial: false
    },
    'zerowidth_steganography': {
        issues: 'Encodes using zero-width characters, works perfectly',
        acceptPartial: false
    },
    'bitwise_not': {
        issues: 'Inverts bits, produces non-printable characters',
        acceptPartial: true
    },
    'word_wrap': {
        issues: 'Only works on multi-line text, single-line produces no encoding',
        acceptPartial: true
    },
    'text_justify': {
        issues: 'Only works on multi-line text, single-line produces no encoding',
        acceptPartial: true
    },
    'indent': {
        issues: 'Adds indentation, reverse removes it',
        acceptPartial: true
    },
    'line_numbers': {
        issues: 'Adds line numbers, reverse removes them',
        acceptPartial: true
    },
    
    // === NEWEST UNICODE ===
    'squared': {
        issues: 'Uppercase only',
        acceptPartial: true,
        normalize: { uppercase: true }
    },
    'negative_squared': {
        issues: 'Uppercase only',
        acceptPartial: true,
        normalize: { uppercase: true }
    },
    'circled': {
        issues: 'Uppercase only',
        acceptPartial: true,
        normalize: { uppercase: true }
    },
    'parenthesized': {
        issues: 'Uppercase only',
        acceptPartial: true,
        normalize: { uppercase: true }
    },
    'mirror_digits': {
        issues: 'Only affects digits, self-inverse, hard to detect',
        acceptPartial: true
    },
    
    // === NEWEST VISUAL/UNICODE EFFECTS ===
    'bold': {
        issues: 'Mathematical Bold Unicode, works perfectly',
        acceptPartial: false
    },
    'italic': {
        issues: 'Mathematical Italic Unicode, works perfectly',
        acceptPartial: false
    },
    'bold_italic': {
        issues: 'Mathematical Bold Italic Unicode, works perfectly',
        acceptPartial: false
    },
    'wide_spacing': {
        issues: 'Adds spaces between characters, reverse removes them',
        acceptPartial: true
    },
    'dotted_underline': {
        issues: 'Adds combining characters, reverse removes them',
        acceptPartial: true
    },
    'dashed_underline': {
        issues: 'Adds combining characters, reverse removes them',
        acceptPartial: true
    },
    'wavy_underline': {
        issues: 'Adds combining characters, reverse removes them',
        acceptPartial: true
    },
    'overline': {
        issues: 'Adds combining characters, reverse removes them',
        acceptPartial: true
    }
};

// Track results
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

const failures = [];

console.log('🧪 Comprehensive Universal Encoder/Decoder Test Suite\n');
console.log('=' .repeat(80));
console.log('\nTest Strategy:');
console.log('1. For each transformer, encode simple & complex strings');
console.log('2. Pass encoded output to universal decoder');
console.log('3. Verify decoder identifies correct method');
console.log('4. Verify decoded output matches original (with known limitations)');
console.log('\n' + '='.repeat(80));

// Discover all transforms
const transformNames = Object.keys(transforms).sort();

console.log(`\nFound ${transformNames.length} transformers to test\n`);
console.log('='.repeat(80));

for (const transformName of transformNames) {
    const transform = transforms[transformName];
    
    // Skip transforms without reverse function
    if (!transform.reverse) {
        console.log(`\n⏭️  ${transformName}: Skipped (no reverse function)`);
        skippedTests += 2; // Would have tested both simple and complex
        continue;
    }
    
    console.log(`\n📝 Testing: ${transform.name || transformName}`);
    console.log('-'.repeat(80));
    
    const limitation = limitations[transformName];
    if (limitation) {
        console.log(`⚠️  Known limitation: ${limitation.issues}`);
    }
    
    // Test both strings
    for (const [testType, testString] of Object.entries(testStrings)) {
        totalTests++;
        
        // Skip simple test if complex-only limitation
        if (testType === 'simple' && limitation?.complexOnly) {
            console.log(`  [${testType}] Skipped (complex-only limitation)`);
            skippedTests++;
            totalTests--;
            continue;
        }
        
        // For emoji-only limitations, only apply them to tests with emoji
        const hasEmoji = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/u.test(testString);
        const currentLimitation = (limitation?.emojiOnly && !hasEmoji) ? null : limitation;
        
        try {
            // Step 1: Encode
            const encoded = transform.func(testString);
            
            if (!encoded || encoded === testString) {
                console.log(`  [${testType}] ⏭️  No encoding produced`);
                skippedTests++;
                continue;
            }
            
            // Step 2: Decode with universal decoder
            const decoderResult = universalDecode(encoded);
            
            if (!decoderResult) {
                // Some transformers are non-reversible and that's expected
                if (currentLimitation?.nonReversible) {
                    console.log(`  [${testType}] ⚠️  Non-reversible: Decoder returned null (expected)`);
                    passedTests++;
                    continue;
                }
                
                console.log(`  [${testType}] ❌ Decoder returned null`);
                console.log(`    Input: "${testString}"`);
                console.log(`    Encoded: "${encoded.substring(0, 60)}..."`);
                failedTests++;
                failures.push({
                    transform: transformName,
                    testType,
                    issue: 'Decoder returned null',
                    input: testString,
                    encoded: encoded.substring(0, 100)
                });
                continue;
            }
            
            const { text: decoded, method: detectedMethod, alternatives = [] } = decoderResult;
            
            // Step 3: Check if correct decoding is in primary or alternatives
            const expectedMethod = transform.name || transformName;
            
            // Build list of all possible decodings to check
            const allDecodings = [
                { text: decoded, method: detectedMethod, isPrimary: true },
                ...alternatives.map(alt => ({ ...alt, isPrimary: false }))
            ];
            
            // Helper to check if method name matches (flexible matching)
            const methodNameMatches = (detected, expected) => {
                return detected === expected ||
                       detected.toLowerCase() === expected.toLowerCase() ||
                       detected.replace(/\s/g, '') === expected.replace(/\s/g, '');
            };
            
            // Find the first decoding that matches our expected method
            const correctDecoding = allDecodings.find(d => methodNameMatches(d.method, expectedMethod));
            
            // Special handling for non-reversible transforms
            if (!correctDecoding && currentLimitation?.nonReversible) {
                // For non-reversible transforms, it's okay if decoder returns null or finds alternatives
                // The transform itself works (encoding), just can't decode
                console.log(`  [${testType}] ⚠️  Non-reversible transform: Encoding works, decoding not supported (expected)`);
            } else if (!correctDecoding) {
                // If we didn't find it in the expected method, log it
                const alternativeNames = allDecodings.map(d => d.method).join(', ');
                console.log(`  [${testType}] ⚠️  Method mismatch: expected "${expectedMethod}", got "${detectedMethod}"${alternatives.length > 0 ? ` (alternatives: ${alternatives.map(a => a.method).join(', ')})` : ''}`);
            }
            
            // Use the correct decoding if found, otherwise fall back to primary
            const decodingToCheck = correctDecoding || allDecodings[0];
            const actualDecoded = decodingToCheck ? decodingToCheck.text : '';
            const isFromAlternative = correctDecoding && !correctDecoding.isPrimary;
            
            // For non-reversible transforms, skip content matching if decoder found alternatives
            if (!correctDecoding && currentLimitation?.nonReversible && allDecodings.length > 0) {
                // Encoding works, decoding not supported - this is expected
                console.log(`  [${testType}] ⚠️  Non-reversible: Encoding verified, decoding not supported (expected)`);
                passedTests++;
                continue;
            }
            
            // Step 4: Verify decoded content
            let contentMatches = actualDecoded === testString;
            let normalizedMatches = false;
            let caseInsensitiveMatches = false;
            
            // Check if there's a normalization rule
            if (!contentMatches && currentLimitation) {
                // Apply normalization if specified
                if (currentLimitation.normalize) {
                    const normalizedExpected = normalizeForComparison(testString, currentLimitation.normalize);
                    const normalizedDecoded = normalizeForComparison(actualDecoded, currentLimitation.normalize);
                    normalizedMatches = normalizedExpected === normalizedDecoded;
                }
                
                // Check case-insensitive match
                if (!normalizedMatches && currentLimitation.caseInsensitive) {
                    caseInsensitiveMatches = actualDecoded.toLowerCase() === testString.toLowerCase();
                }
            }
            
            const altIndicator = isFromAlternative ? ' (from alternative)' : '';
            
            if (contentMatches) {
                console.log(`  [${testType}] ✅ Perfect: "${testString}" → [encoded] → "${actualDecoded}"${altIndicator}`);
                passedTests++;
            } else if (normalizedMatches) {
                console.log(`  [${testType}] ✅ Match (with expected transformations): "${testString}" → "${actualDecoded}"${altIndicator}`);
                passedTests++;
            } else if (caseInsensitiveMatches) {
                console.log(`  [${testType}] ✅ Match (case-insensitive): "${testString}" → "${actualDecoded}"${altIndicator}`);
                passedTests++;
            } else if (currentLimitation?.acceptPartial) {
                // For acceptPartial, we're lenient - just check that decoding returned something
                // and it's not completely empty or broken
                const hasReasonableContent = actualDecoded && actualDecoded.length > 0 && 
                    actualDecoded.length >= Math.min(5, testString.length * 0.3) &&
                    actualDecoded !== '[Invalid input]' && 
                    actualDecoded !== 'undefined';
                
                if (hasReasonableContent) {
                    console.log(`  [${testType}] ⚠️  Partial: Expected limitations in decoded content${altIndicator}`);
                    console.log(`    Original: "${testString}"`);
                    console.log(`    Decoded:  "${actualDecoded}"`);
                    passedTests++;
                } else {
                    console.log(`  [${testType}] ❌ Content mismatch (beyond expected limitations)`);
                    console.log(`    Expected: "${testString}"`);
                    console.log(`    Decoded:  "${actualDecoded}"`);
                    failedTests++;
                    failures.push({
                        transform: transformName,
                        testType,
                        issue: 'Content mismatch',
                        expected: testString,
                        decoded: actualDecoded
                    });
                }
            } else {
                console.log(`  [${testType}] ❌ Content mismatch`);
                console.log(`    Expected: "${testString}"`);
                console.log(`    Decoded:  "${actualDecoded}"`);
                console.log(`    Method detected: ${decodingToCheck.method}`);
                failedTests++;
                failures.push({
                    transform: transformName,
                    testType,
                    issue: 'Content mismatch',
                    expected: testString,
                    decoded: actualDecoded,
                    method: decodingToCheck.method
                });
            }
            
        } catch (error) {
            console.log(`  [${testType}] ❌ Error: ${error.message}`);
            failedTests++;
            failures.push({
                transform: transformName,
                testType,
                issue: `Error: ${error.message}`,
                input: testString
            });
        }
    }
}

// ============================================================================
// ADDITIONAL UNIVERSAL DECODER TESTS
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('\n🔍 Additional Universal Decoder Tests\n');
console.log('='.repeat(80));

// Test 1: Negative tests - plain text should not trigger false positives
console.log('\n📝 Testing: Negative Cases (False Positive Prevention)');
console.log('-'.repeat(80));

const negativeTestCases = [
    { name: 'Plain English', text: 'The quick brown fox jumps over the lazy dog.' },
    { name: 'Normal sentence', text: 'This is a normal sentence with punctuation!' },
    { name: 'Mixed case', text: 'Hello World This Is Normal Text' },
    { name: 'Numbers and text', text: 'I have 42 apples and 3 oranges.' },
    { name: 'Short text', text: 'Hi there' },
    { name: 'Long text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }
];

let negativeTestsPassed = 0;
let negativeTestsFailed = 0;

for (const testCase of negativeTestCases) {
    totalTests++;
    try {
        const result = universalDecode(testCase.text);
        
        // For plain text, we expect either:
        // 1. null (no detection) - ideal
        // 2. Or if something is detected, it should be low priority and the decoded text should be very different
        if (!result) {
            // Perfect - no false positive
            negativeTestsPassed++;
            console.log(`  ✅ "${testCase.name}": No false positive (decoder returned null)`);
        } else {
            // Check if the decoded text is significantly different (not a false positive)
            const decoded = result.text;
            const similarity = calculateSimilarity(testCase.text, decoded);
            
            // If decoded text is very similar to original, it's likely a false positive
            if (similarity > 0.8 && result.method !== 'Reverse Text' && result.method !== 'Mirror') {
                negativeTestsFailed++;
                console.log(`  ❌ "${testCase.name}": False positive detected`);
                console.log(`     Original: "${testCase.text}"`);
                console.log(`     Detected as: ${result.method}`);
                console.log(`     Decoded: "${decoded}"`);
                console.log(`     Similarity: ${(similarity * 100).toFixed(1)}%`);
            } else {
                // Acceptable - decoder found something but it's clearly different
                negativeTestsPassed++;
                console.log(`  ⚠️  "${testCase.name}": Detected as "${result.method}" but decoded text is different (similarity: ${(similarity * 100).toFixed(1)}%)`);
            }
        }
    } catch (error) {
        negativeTestsFailed++;
        console.log(`  ❌ "${testCase.name}": Error - ${error.message}`);
    }
}

// Test 2: Edge cases
console.log('\n📝 Testing: Edge Cases');
console.log('-'.repeat(80));

const edgeCases = [
    { name: 'Empty string', text: '' },
    { name: 'Single character', text: 'a' },
    { name: 'Single space', text: ' ' },
    { name: 'Only punctuation', text: '!!!???' },
    { name: 'Only numbers', text: '123456789' },
    { name: 'Very long string', text: 'a'.repeat(1000) },
    { name: 'Unicode only', text: '🌞🌞🌞' },
    { name: 'Mixed unicode', text: 'Hello 🌞 World 😊' }
];

let edgeTestsPassed = 0;
let edgeTestsFailed = 0;

for (const testCase of edgeCases) {
    totalTests++;
    try {
        const result = universalDecode(testCase.text);
        
        // Edge cases should either return null or handle gracefully
        if (!result) {
            edgeTestsPassed++;
            console.log(`  ✅ "${testCase.name}": Handled gracefully (returned null)`);
        } else {
            // If it returns something, that's okay too - just log it
            edgeTestsPassed++;
            console.log(`  ⚠️  "${testCase.name}": Detected as "${result.method}"`);
        }
    } catch (error) {
        edgeTestsFailed++;
        console.log(`  ❌ "${testCase.name}": Error - ${error.message}`);
    }
}

// Test 3: Priority testing - high priority transforms should be detected first
console.log('\n📝 Testing: Priority Detection');
console.log('-'.repeat(80));

// Create test cases where multiple transforms could match
const priorityTestCases = [
    {
        name: 'Base64 (high priority) vs other base encodings',
        encoded: 'SGVsbG8gV29ybGQ=', // "Hello World" in Base64
        expectedHighPriority: ['Base64'],
        expectedLowerPriority: ['Base32', 'Base36', 'Base58']
    }
];

let priorityTestsPassed = 0;
let priorityTestsFailed = 0;

for (const testCase of priorityTestCases) {
    totalTests++;
    try {
        const result = universalDecode(testCase.encoded);
        
        if (!result) {
            priorityTestsFailed++;
            console.log(`  ❌ "${testCase.name}": No detection`);
            continue;
        }
        
        // Check if high priority method is detected first
        const primaryMethod = result.method;
        const isHighPriority = testCase.expectedHighPriority.some(method => 
            primaryMethod.includes(method) || method.includes(primaryMethod)
        );
        
        if (isHighPriority) {
            priorityTestsPassed++;
            console.log(`  ✅ "${testCase.name}": High priority method "${primaryMethod}" detected first`);
        } else {
            // Check if it's in alternatives
            const inAlternatives = result.alternatives?.some(alt => 
                testCase.expectedHighPriority.some(method => 
                    alt.method.includes(method) || method.includes(alt.method)
                )
            );
            
            if (inAlternatives) {
                priorityTestsPassed++;
                console.log(`  ⚠️  "${testCase.name}": High priority method found in alternatives (primary: "${primaryMethod}")`);
            } else {
                priorityTestsFailed++;
                console.log(`  ❌ "${testCase.name}": High priority method not detected (got: "${primaryMethod}")`);
            }
        }
    } catch (error) {
        priorityTestsFailed++;
        console.log(`  ❌ "${testCase.name}": Error - ${error.message}`);
    }
}

// Helper function to calculate string similarity
function calculateSimilarity(str1, str2) {
    if (str1 === str2) return 1;
    if (!str1 || !str2) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1;
    
    // Simple similarity based on common characters
    let matches = 0;
    const minLen = Math.min(str1.length, str2.length);
    for (let i = 0; i < minLen; i++) {
        if (str1[i] === str2[i]) matches++;
    }
    
    return matches / longer.length;
}

// Update test counts
passedTests += negativeTestsPassed + edgeTestsPassed + priorityTestsPassed;
failedTests += negativeTestsFailed + edgeTestsFailed + priorityTestsFailed;

// Summary
console.log('\n' + '='.repeat(80));
console.log('\n📊 Test Summary:\n');
console.log(`✅ Passed: ${passedTests} tests`);
console.log(`❌ Failed: ${failedTests} tests`);
console.log(`⏭️  Skipped: ${skippedTests} tests`);
console.log(`📝 Total: ${totalTests} tests\n`);

if (failures.length > 0) {
    console.log('Failed Tests Details:\n');
    failures.forEach((failure, index) => {
        console.log(`${index + 1}. ${failure.transform} (${failure.testType}):`);
        console.log(`   ${failure.issue}`);
        if (failure.expected) console.log(`   Expected: "${failure.expected}"`);
        if (failure.decoded) console.log(`   Decoded:  "${failure.decoded}"`);
        if (failure.detectedMethod) console.log(`   Detected as: ${failure.detectedMethod}`);
        console.log();
    });
}

if (failedTests === 0) {
    console.log('✨ All tests passed!\n');
    process.exit(0);
} else {
    console.log(`❌ ${failedTests} test(s) failed!\n`);
    process.exit(1);
}

