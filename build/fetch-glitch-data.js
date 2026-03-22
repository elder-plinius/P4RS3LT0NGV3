#!/usr/bin/env node
/**
 * Script to fetch and format glitch token data from the repository
 * This script reads the JSON from stdin and writes it as a JavaScript file
 */

const fs = require('fs');
const path = require('path');

// Read JSON from stdin
let jsonData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
    jsonData += chunk;
});

process.stdin.on('end', () => {
    try {
        const json = JSON.parse(jsonData);
        
        const output = `/**
 * Glitch Tokens Data
 * Contains glitch token data structure (LLM vocabulary anomalies)
 * 
 * Source: https://github.com/elder-plinius/L1B3RT4S
 * Format: AGGREGLITCH structure
 * 
 * This file contains the complete glitch token data from the AGGREGLITCH repository.
 * Last updated: ${json._metadata.last_updated}
 * Total tokens cataloged: ${json._metadata.total_tokens_cataloged}
 */

window.glitchTokensData = ${JSON.stringify(json, null, 4)};
`;

        const outputPath = path.join(__dirname, '..', 'js', 'data', 'glitchTokens.js');
        fs.writeFileSync(outputPath, output, 'utf8');
        
        console.log(`✅ Glitch token data written successfully!`);
        console.log(`   File: ${outputPath}`);
        console.log(`   Total tokens: ${json._metadata.total_tokens_cataloged}`);
        console.log(`   Last updated: ${json._metadata.last_updated}`);
    } catch (error) {
        console.error('Error processing JSON:', error.message);
        process.exit(1);
    }
});

