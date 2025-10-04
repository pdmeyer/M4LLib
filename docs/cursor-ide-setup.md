# Cursor IDE Setup for M4LLib

This guide helps you configure Cursor IDE for development of the M4LLib Max for Live library.

## Overview

Cursor IDE provides excellent AI-assisted development features that can be customized for Max for Live development. This guide covers:

- **Cursor Rules** configuration
- **Project-specific settings**
- **AI prompt templates**
- **Code snippets and autocomplete**
- **Debugging and testing setup**

## 📁 Cursor Rules Configuration

### Create `.cursorrules` File

Place this file in your project root:

```markdown
# M4LLib Development Rules

## Project Context
You are working on M4LLib, a utility library for Max for Live (M4L) operations. This library provides helpful functions for interacting with Ableton Live's API within Max for Live devices.

## Code Style & Standards

### JavaScript Standards
- Use ES6+ features when possible
- Follow JSDoc documentation standards
- Maintain consistent indentation (2 spaces)
- Use descriptive variable names
- Add comprehensive error handling for all public methods

### Max for Live Specific
- Always free LiveAPI objects with `freepeer()`
- Use consistent ID handling (numeric IDs internally)
- Validate all inputs before processing
- Provide helpful error messages
- Handle errors gracefully with try-catch blocks

### Error Handling
- Use the custom error classes from `m4l-errors.js`
- Always wrap operations in try-catch blocks
- Use `M4LLibErrors.ErrorHandler.handle()` for consistent error handling
- Provide meaningful error context and debugging information

## Architecture Guidelines

### Function Design
- Keep functions focused and single-purpose
- Use static methods for utility functions
- Validate all parameters at function entry
- Return meaningful values (avoid undefined returns)
- Document all public methods with JSDoc

### Resource Management
- Always clean up LiveAPI objects in finally blocks
- Use defer() for operations that can't run immediately
- Batch operations when possible
- Avoid creating unnecessary LiveAPI objects

## Documentation Requirements

### JSDoc Standards
- Document all public methods with @static, @param, @returns, @throws
- Include @example for complex methods
- Use @since for version tracking
- Document parameter types and constraints

### Code Comments
- Explain complex Live API operations
- Document ID handling conventions
- Comment on error handling strategies
- Note performance considerations

## Testing & Quality

### Input Validation
- Validate all external inputs
- Use ValidationUtils for common checks
- Provide clear error messages for invalid inputs
- Test edge cases and boundary conditions

### Error Scenarios
- Test with invalid IDs
- Test with missing Live objects
- Test with unsupported track types
- Test error recovery mechanisms

## AI Assistant Guidelines

When helping with code:

1. **Understand the Max for Live context** - this is JavaScript running in Max, not Node.js
2. **Suggest appropriate error handling** - always include try-catch and resource cleanup
3. **Recommend M4LLib functions** - suggest existing library functions when possible
4. **Explain Live API concepts** - help understand how Ableton Live objects work
5. **Provide complete examples** - include error handling and cleanup code

## Export Patterns and Module Loading

### Dual Environment Support
M4LLib is designed to work in both Max for Live and Node.js environments using conditional export patterns.

### Max for Live Export Pattern
```javascript
// Export all error classes and utilities
if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    module.exports = { /* exports */ };
} else {
    // Max for Live environment - make available globally
    global.M4LLibErrors = { /* exports */ };
}
```

### Key Points for Development
- **Global Availability**: In Max for Live, classes are available globally via `global.M4LLibErrors` and `global.M4LLib`
- **Compatibility**: The `exports = M4LLib` pattern is supported for Max for Live compatibility
- **Loading Order**: Always include `m4l-errors.js` before `m4l-lib.js`
- **Access Pattern**: Functions are accessed directly: `M4LLib.getThisTrackId()`

### Testing Considerations
- Test both export patterns when making changes
- Verify global availability in Max for Live environment
- Ensure Node.js compatibility is maintained

## Common Patterns

### Creating MIDI Clips
```javascript
try {
    const trackId = M4LLib.getThisTrackId();
    const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
    const success = M4LLib.dumpNotesToNextEmptyClipForTrack(trackId, notes);
    return success;
} catch (error) {
    M4LLibErrors.ErrorHandler.handle(error, 'createMidiClip', false);
    return false;
}
```

### Working with IDs
```javascript
// Convert various ID formats to numeric
const numericId = M4LLib.conformId("id 123");

// Validate before use
if (M4LLib.validateId(numericId)) {
    // Use the ID
}

// Add prefix when needed for LiveAPI
const liveApi = new LiveAPI(M4LLib.prefixId(numericId));
```

### Resource Management
```javascript
let liveApi = null;
try {
    liveApi = new LiveAPI('some_path');
    // Use liveApi
} catch (error) {
    M4LLibErrors.ErrorHandler.handle(error, 'methodName', false);
} finally {
    if (liveApi) liveApi.freepeer();
}
```

## File Organization

### Library Structure
- `lib/` - Core library files
- `docs/` - Documentation and guides
- `examples/` - Usage examples and demos

### Import Order
1. Error handling system (`m4l-errors.js`)
2. Main library (`m4l-lib.js`)
3. Custom extensions or utilities

## Performance Considerations

### Live API Usage
- Minimize LiveAPI object creation
- Reuse objects when possible
- Use defer() for non-critical operations
- Batch operations to reduce API calls

### Memory Management
- Always call freepeer() on LiveAPI objects
- Avoid creating objects in loops
- Use try-catch-finally for cleanup
- Monitor memory usage in complex operations
```

## ⚙️ Cursor Settings

### Create `.vscode/settings.json`

```json
{
  "editor.tabSize": 2,
  "editor.insertSpaces": true,
  "editor.rulers": [80, 120],
  "editor.wordWrap": "bounded",
  "editor.wordWrapColumn": 120,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  
  "javascript.format.enable": true,
  "javascript.suggest.autoImports": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  
  "typescript.preferences.includePackageJsonAutoImports": "on",
  
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  
  "files.associations": {
    "*.js": "javascript",
    "*.md": "markdown"
  },
  
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.git": true
  }
}
```

### Create `.vscode/extensions.json`

```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-markdownlint"
  ]
}
```

## 🤖 AI Prompt Templates

### Function Creation Template

```
I need to create a new function for M4LLib that [DESCRIPTION]. 

Requirements:
- Function name: [NAME]
- Purpose: [PURPOSE]
- Parameters: [PARAMETERS]
- Returns: [RETURN_VALUE]

Please:
1. Follow M4LLib coding standards
2. Include comprehensive error handling
3. Use appropriate error types from m4l-errors.js
4. Add JSDoc documentation
5. Include usage examples
6. Consider performance implications
```

### Code Review Template

```
Please review this M4LLib function for:

1. **Code Quality**: Follows M4LLib standards?
2. **Error Handling**: Proper try-catch and cleanup?
3. **Documentation**: Complete JSDoc?
4. **Performance**: Efficient Live API usage?
5. **Edge Cases**: Handles invalid inputs?
6. **Resource Management**: Proper freepeer() usage?

Function code:
[PASTE_CODE_HERE]
```

### Debugging Template

```
I'm having an issue with this M4LLib code:

[PASTE_CODE_HERE]

Error message: [ERROR_MESSAGE]

Please help me:
1. Identify the problem
2. Suggest a solution
3. Explain why it happened
4. Show me the corrected code
5. Suggest how to prevent it in the future
```

## 📝 Code Snippets

### Create `.vscode/m4l-snippets.code-snippets`

```json
{
  "M4LLib Function Template": {
    "prefix": "m4lfunc",
    "body": [
      "/**",
      " * ${1:Function description}",
      " * ",
      " * @static",
      " * @param {${2:type}} ${3:paramName} - ${4:Parameter description}",
      " * @returns {${5:type}} ${6:Return description}",
      " * @throws {${7:ErrorType}} ${8:When error is thrown}",
      " * ",
      " * @example",
      " * ${9:Usage example}",
      " */",
      "static ${1:functionName}(${3:paramName}) {",
      "\tconst methodName = 'M4LLib.${1:functionName}';",
      "\t",
      "\ttry {",
      "\t\t// Validate inputs",
      "\t\t${10:// Add validation here}",
      "\t\t",
      "\t\t// Implementation",
      "\t\t${11:// Add implementation here}",
      "\t\t",
      "\t\treturn ${12:result};",
      "\t\t",
      "\t} catch (error) {",
      "\t\tM4LLibErrors.ErrorHandler.handle(error, methodName, false);",
      "\t\treturn ${13:null};",
      "\t}",
      "}"
    ],
    "description": "Template for M4LLib static methods"
  },
  
  "M4LLib Try-Catch Block": {
    "prefix": "m4ltry",
    "body": [
      "try {",
      "\t${1:// Operation here}",
      "} catch (error) {",
      "\tM4LLibErrors.ErrorHandler.handle(error, '${2:methodName}', false);",
      "\t${3:return null;}",
      "}"
    ],
    "description": "Standard M4LLib error handling block"
  },
  
  "M4LLib Resource Management": {
    "prefix": "m4lresource",
    "body": [
      "let ${1:resource} = null;",
      "try {",
      "\t${1:resource} = new LiveAPI('${2:path}');",
      "\t${3:// Use resource}",
      "} catch (error) {",
      "\tM4LLibErrors.ErrorHandler.handle(error, '${4:methodName}', false);",
      "} finally {",
      "\tif (${1:resource}) ${1:resource}.freepeer();",
      "}"
    ],
    "description": "Safe resource management with cleanup"
  }
}
```

## 🔧 Project-Specific Configuration

### Create `.cursorignore`

```
node_modules/
dist/
build/
*.log
.DS_Store
*.amxd
*.maxpat
*.maxhelp
```

### Create `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

## 🚀 Getting Started

### 1. Install Cursor IDE
Download and install Cursor IDE from [cursor.sh](https://cursor.sh)

### 2. Open Project
Open your M4LLib project folder in Cursor

### 3. Apply Configuration
- Copy `.cursorrules` to project root
- Create `.vscode/` folder with settings
- Add code snippets file

### 4. Test AI Features
- Ask Cursor to explain M4LLib functions
- Request code reviews
- Ask for debugging help
- Generate new functions

## 📚 Additional Resources

### Cursor IDE Features
- **AI Chat**: Right-click code for context-aware help
- **Code Generation**: Generate functions from descriptions
- **Code Review**: Get AI feedback on your code
- **Debugging**: AI-assisted problem solving

### Max for Live Development
- **Live API Reference**: [Ableton Live API Documentation](https://www.ableton.com/en/api/)
- **Max for Live**: [Cycling '74 Documentation](https://docs.cycling74.com/)
- **JavaScript in Max**: [Max JavaScript Reference](https://docs.cycling74.com/max8/refpages/js-ref.html)

---

**Happy coding with Cursor IDE and M4LLib!** 🎵
