#!/usr/bin/env node
/**
 * Inject tool templates into index.html
 * Reads HTML from separate template files and injects them into the main template
 */

const fs = require('fs');
const path = require('path');

console.log('📝 Injecting tool templates into index.html...\n');

// Template files in order
const templateFiles = [
    'anticlassifier.html',
    'decoder.html',
    'steganography.html',
    'transforms.html',
    'promptcraft.html',
    'tokenade.html',
    'fuzzer.html',
    'tokenizer.html',
    'bijection.html',
    'splitter.html',
    'gibberish.html',
    'spellingalphabet.html',
    'codes.html'
];


const templatesDir = path.join(__dirname, '../templates');
let allToolHTML = '';

// Read each template file
templateFiles.forEach(templateFile => {
    const templatePath = path.join(templatesDir, templateFile);
    
    if (!fs.existsSync(templatePath)) {
        console.log(`⚠️  Warning: ${templateFile} not found`);
        return;
    }
    
    const html = fs.readFileSync(templatePath, 'utf8');
    console.log(`✅ Loaded: ${templateFile} (${(html.length / 1024).toFixed(2)}KB)`);
    allToolHTML += html + '\n\n';
});

// Read index.template.html (base template)
const templatePath = path.join(__dirname, '../index.template.html');
const indexPath = path.join(__dirname, '../dist', 'index.html');

if (!fs.existsSync(templatePath)) {
    console.error('\n❌ index.template.html not found!');
    process.exit(1);
}

let indexContent = fs.readFileSync(templatePath, 'utf8');
indexContent = indexContent.replace(/\r\n/g, '\n');

// Find the tool-content-container
const startMarker = '<div id="tool-content-container"';

const startIndex = indexContent.indexOf(startMarker);
const startTagEnd = indexContent.indexOf('>', startIndex);
const endIndex = indexContent.indexOf('</div>', startTagEnd);

if (startIndex === -1 || startTagEnd === -1 || endIndex === -1) {
    console.error('\n❌ Could not find tool content container markers');
    process.exit(1);
}

// Find the </main> tag that follows the container's closing </div>
// Use regex to handle both Unix (\n) and Windows (\r\n) line endings
const afterClosingDiv = indexContent.substring(endIndex + '</div>'.length);
const mainMatch = afterClosingDiv.match(/^\r?\n\s*<\/main>/);

if (!mainMatch) {
    console.error('\n❌ Could not find </main> after container closing </div>');
    process.exit(1);
}

const endIndex2 = endIndex + '</div>'.length + mainMatch[0].length;

// Build the replacement content
const before = indexContent.substring(0, startTagEnd + 1);
const after = indexContent.substring(endIndex2);

const replacement = `
                <!-- Tool templates injected from templates/ directory -->
${allToolHTML}            `;

const newContent = before + replacement + after;

// Calculate size changes
const oldSize = indexContent.length;
const newSize = newContent.length;
const sizeDiff = newSize - oldSize;

// Ensure dist directory exists
const distDir = path.dirname(indexPath);
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Write back
fs.writeFileSync(indexPath, newContent, 'utf8');

console.log('\n✨ Tool templates injected into index.html');
console.log(`📦 index.html: ${(newSize / 1024).toFixed(2)}KB ${sizeDiff > 0 ? '+' : ''}${(sizeDiff / 1024).toFixed(2)}KB`);
console.log(`🔧 ${templateFiles.length} templates injected\n`);

