# M4LLib Error Handling Guide

This guide explains how to use the comprehensive error handling system in M4LLib for robust Max for Live development.

## Overview

The M4LLib error handling system provides:

- **Custom Error Classes** for different types of errors
- **Consistent Error Handling** across all library methods
- **Detailed Error Context** for debugging and user feedback
- **Input Validation** utilities
- **Error Recovery** strategies
- **User-Friendly Error Messages**

## File Structure

```
lib/
├── m4l-errors.js          # Error handling system
├── pdm.m4l.lib.js         # Main library (updated with error handling)
examples/
├── error-handling-example.js  # Comprehensive examples
docs/
└── error-handling-guide.md    # This guide
```

## Quick Start

### 1. Include Error Handling

In your Max for Live project, include the error handling system before the main library:

```javascript
// First, include the error handling system
const M4LLibErrors = require("m4l-errors.js")M4LLibErrors;

// Then include the main library
const M4LLib = require("pdm.m4l.lib.js")M4LLib;
```

### 2. Basic Usage

```javascript
function bang() {
    try {
        const trackId = M4LLib.getThisTrackId();
        post('Track ID: ', trackId, '\n');
        
    } catch (error) {
        // Error is automatically handled and logged
        post('Operation failed: ', error.message, '\n');
    }
}
```

## Error Classes

### Base Error Class

```javascript
class M4LLibError extends Error {
    constructor(message, code, context, method)
}
```

**Properties:**
- `message`: Human-readable error description
- `code`: Error code for programmatic handling
- `context`: Additional context information
- `method`: Method where error occurred
- `timestamp`: When the error occurred

### Specific Error Types

| Error Class | Code | Description |
|-------------|------|-------------|
| `InvalidIdError` | `INVALID_ID` | ID format or validation errors |
| `LiveApiError` | `LIVE_API_ERROR` | Live API operation failures |
| `MidiOperationError` | `MIDI_OPERATION_ERROR` | MIDI-related operation failures |
| `TrackOperationError` | `TRACK_OPERATION_ERROR` | Track operation failures |
| `DeviceOperationError` | `DEVICE_OPERATION_ERROR` | Device operation failures |
| `ValidationError` | `VALIDATION_ERROR` | Parameter validation failures |

## Input Validation

### Validation Utilities

```javascript
// Validate parameter types
M4LLibErrors.ValidationUtils.validateNumber(value, 'paramName', 'methodName');
M4LLibErrors.ValidationUtils.validateString(value, 'paramName', 'methodName');
M4LLibErrors.ValidationUtils.validateArray(value, 'paramName', 'methodName');
M4LLibErrors.ValidationUtils.validateObject(value, 'paramName', 'methodName');
M4LLibErrors.ValidationUtils.validateFunction(value, 'paramName', 'methodName');
```

### Example

```javascript
function createMidiClip(length, trackId) {
    try {
        // Validate inputs
        M4LLibErrors.ValidationUtils.validateNumber(length, 'length', 'createMidiClip');
        M4LLibErrors.ValidationUtils.validateNumber(trackId, 'trackId', 'createMidiClip');
        
        // Proceed with operation
        return M4LLib.createNewEmptyMidiClip(length, trackId);
        
    } catch (error) {
        M4LLibErrors.ErrorHandler.handle(error, 'createMidiClip', false);
        return null;
    }
}
```

## Error Handling Patterns

### 1. Try-Catch with Automatic Handling

```javascript
function safeOperation() {
    try {
        return M4LLib.someMethod();
    } catch (error) {
        // Automatically handles, logs, and posts to Max console
        M4LLibErrors.ErrorHandler.handle(error, 'safeOperation', false);
        return null;
    }
}
```

### 2. Programmatic Error Handling

```javascript
function handleErrorsByType() {
    try {
        return M4LLib.someMethod();
    } catch (error) {
        switch (error.code) {
            case 'INVALID_ID':
                // Handle ID errors
                const fixedId = M4LLib.conformId(error.context.received);
                return retryWithFixedId(fixedId);
                
            case 'LIVE_API_ERROR':
                // Handle Live API errors
                return retryAfterDelay();
                
            case 'VALIDATION_ERROR':
                // Handle validation errors
                return useDefaultValues();
                
            default:
                // Handle unknown errors
                M4LLibErrors.ErrorHandler.handle(error, 'handleErrorsByType', false);
                return null;
        }
    }
}
```

### 3. Graceful Degradation

```javascript
function robustOperation() {
    let result;
    
    // Try primary method
    try {
        result = M4LLib.primaryMethod();
    } catch (error) {
        post('Primary method failed: ', error.message, '\n');
        
        // Try fallback method
        try {
            result = M4LLib.fallbackMethod();
        } catch (fallbackError) {
            post('Fallback also failed: ', fallbackError.message, '\n');
            return null;
        }
    }
    
    return result;
}
```

## Error Context and Debugging

### Error Information

Each error includes rich context:

```javascript
try {
    M4LLib.someMethod();
} catch (error) {
    post('=== ERROR DETAILS ===\n');
    post('Message: ', error.message, '\n');
    post('Code: ', error.code, '\n');
    post('Method: ', error.method, '\n');
    post('Timestamp: ', error.timestamp, '\n');
    post('Context: ', JSON.stringify(error.context, null, 2), '\n');
    post('Stack: ', error.stack, '\n');
}
```

### User-Friendly Messages

```javascript
const userMessage = M4LLibErrors.ErrorHandler.formatUserMessage(error);
post('User Message: ', userMessage, '\n');
```

This provides helpful tips based on error type:
- **INVALID_ID**: "Use M4LLib.conformId() to convert ID formats"
- **VALIDATION_ERROR**: "Check your input parameters and ensure they match the expected format"
- **LIVE_API_ERROR**: "Ensure Ableton Live is running and the target object exists"

## Custom Error Handling

### Custom Error Handler

```javascript
const customHandler = {
    handle: function(error, context) {
        if (error.code === 'MIDI_OPERATION_ERROR') {
            // Custom handling for MIDI errors
            if (context.retryCount < 3) {
                context.retryCount++;
                return true; // Indicate retry should happen
            }
        }
        
        // Use default handling for other errors
        M4LLibErrors.ErrorHandler.handle(error, context.method, false);
        return false;
    }
};
```

### Error Recovery Strategies

```javascript
const recoveryStrategies = {
    'INVALID_ID': function(error) {
        // Try to fix the ID
        return M4LLib.conformId(error.context.received);
    },
    
    'LIVE_API_ERROR': function(error) {
        // Wait and retry
        M4LLib.defer(() => retryOperation(), null, [], 1000);
        return null;
    }
};

// Use recovery strategy
const strategy = recoveryStrategies[error.code];
if (strategy) {
    const result = strategy(error);
    // Handle recovery result
}
```

## 📝 Best Practices

### 1. Always Use Try-Catch

```javascript
// ✅ Good
function safeFunction() {
    try {
        return M4LLib.someMethod();
    } catch (error) {
        M4LLibErrors.ErrorHandler.handle(error, 'safeFunction', false);
        return null;
    }
}

// ❌ Bad
function unsafeFunction() {
    return M4LLib.someMethod(); // Could crash
}
```

### 2. Provide Meaningful Context

```javascript
// ✅ Good
throw new M4LLibErrors.ValidationError(
    'Parameter must be a positive number',
    { received: value, expected: 'positive number', min: 0 },
    'methodName'
);

// ❌ Bad
throw new Error('Invalid parameter');
```

### 3. Use Appropriate Error Types

```javascript
// ✅ Good - specific error type
throw new M4LLibErrors.InvalidIdError('Invalid track ID format');

// ❌ Bad - generic error
throw new Error('Something went wrong');
```

### 4. Clean Up Resources

```javascript
let liveApi = null;
try {
    liveApi = new LiveAPI('some_path');
    // Use liveApi
} catch (error) {
    M4LLibErrors.ErrorHandler.handle(error, 'methodName', false);
} finally {
    // Always clean up
    if (liveApi) liveApi.freepeer();
}
```

## Testing Error Handling

### Test Error Scenarios

```javascript
function testErrorHandling() {
    // Test validation errors
    try {
        M4LLibErrors.ValidationUtils.validateNumber('not_a_number', 'test', 'test');
    } catch (error) {
        post('Validation error caught: ', error.message, '\n');
    }
    
    // Test custom errors
    try {
        throw new M4LLibErrors.MidiOperationError('Test error');
    } catch (error) {
        post('Custom error caught: ', error.message, '\n');
    }
}
```

## Troubleshooting

### Common Issues

1. **Error not being caught**: Ensure you're using try-catch
2. **Error context missing**: Check that you're passing method name
3. **Validation not working**: Verify parameter names and types
4. **Memory leaks**: Always use `freepeer()` in finally blocks

### Debug Mode

Enable detailed logging:

```javascript
// Set debug level (if implemented)
M4LLibErrors.ErrorHandler.setDebugLevel('verbose');
```

## Examples

See `examples/error-handling-example.js` for comprehensive examples of:

- Basic error handling
- Error code handling
- Graceful error handling
- Custom error handlers
- Error logging and debugging
- Input validation
- Error recovery strategies

## Contributing

When adding new methods to M4LLib:

1. **Use appropriate error types** for different failure modes
2. **Validate all inputs** using ValidationUtils
3. **Provide meaningful error context**
4. **Handle errors gracefully** with try-catch
5. **Clean up resources** in finally blocks
6. **Test error scenarios** thoroughly

---

**Remember**: Good error handling makes your Max for Live devices more robust and user-friendly!
