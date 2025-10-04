#!/usr/bin/env node

/**
 * Post-processes JSDoc-generated markdown to suppress the constructor
 */

// Read from stdin and process
let input = '';
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
        input += chunk;
    }
});

process.stdin.on('end', () => {
    // Simple approach: just remove the constructor
    let output = input;
    
    // Remove constructor entries from the method list
    output = output.replace(/\*\s*\[new M4LLib\(\)\]\(#new_M4LLib_new\)\s*\n/g, '');
    
    // Remove constructor documentation sections (both ## and ### formats)
    output = output.replace(/<a name="new_M4LLib_new"><\/a>\s*\n\s*## new M4LLib\(\)[\s\S]*?(?=### M4LLib\.|## )/g, '');
    output = output.replace(/<a name="new_M4LLib_new"><\/a>\s*\n\s*### new M4LLib\(\)[\s\S]*?(?=### M4LLib\.|## )/g, '');
    
    // Also remove any remaining constructor sections
    output = output.replace(/### new M4LLib\(\)[\s\S]*?(?=### M4LLib\.|## )/g, '');
    output = output.replace(/## new M4LLib\(\)[\s\S]*?(?=### M4LLib\.|## )/g, '');
    
    process.stdout.write(output);
});