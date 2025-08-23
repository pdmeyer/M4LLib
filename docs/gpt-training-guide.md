# M4LLib GPT Training Guide

This guide provides all the information needed to train a GPT (like ChatGPT) on the M4LLib library to help users find the right functions for their use cases.

## Purpose

The GPT will act as an intelligent assistant that can:
- Understand user requirements and suggest appropriate M4LLib functions
- Provide code examples and usage patterns
- Explain function parameters and return values
- Offer best practices and troubleshooting tips
- Guide users through common Max for Live development tasks

## Training Data Structure

### 1. Library Overview
```
M4LLib is a utility library for Max for Live (M4L) operations that provides helpful functions for interacting with Ableton Live's API. The library simplifies common operations like managing MIDI clips, tracks, and clip slots.

Key Features:
- MIDI Management: Create, modify, and manage MIDI clips and notes
- Track Operations: Work with Live tracks, clip slots, and scenes
- Device Control: Navigate and control Live devices
- ID Handling: Consistent and reliable ID management utilities
- Task Scheduling: Defer operations using Max's Task system
- Error Handling: Comprehensive validation and error checking
```

### 2. Max JavaScript Environment Context

**IMPORTANT**: M4LLib runs in the Max for Live JavaScript environment, which is fundamentally different from browser or Node.js environments.

#### Max JavaScript API
- **Reference**: [Max JavaScript API Documentation](https://docs.cycling74.com/apiref/js/)
- **Environment**: JavaScript runs within Max objects like `[js]`, `[jsui]`, `[v8]`, `[v8.codebox]`, and `[v8ui]`
- **Threading**: Cannot run in high-priority thread; use `defer` or `deferlow` objects

#### Max-Specific Classes and Functions
- **`LiveAPI`**: Primary interface for communicating with Ableton Live API
- **`Task`**: Max's task scheduling system (use instead of `setTimeout`)
- **`Dict`**: Max dictionary object for data storage
- **`messnamed`**: Send messages to named Max objects
- **`post`/`error`/`cpost`**: Console output functions
- **`jsthis`**: Context object for Max JavaScript environment

#### Browser/Node.js Limitations
- **NO `setTimeout`** - Use Max's `Task` system instead
- **NO `async/await`** - Use callbacks or Max's defer system
- **NO `fetch`** - Use Max's file I/O or network objects
- **NO `console.log`** - Use `post()` for output
- **NO `Promise`** - Use callbacks or Max's event system

#### LiveAPI Class
- **Reference**: [LiveAPI Documentation](https://docs.cycling74.com/apiref/js/liveapi/)
- **Purpose**: Communicate with Ableton Live's API from JavaScript
- **Key Methods**: `get()`, `set()`, `call()`, `goto()`
- **Properties**: `id`, `path`, `children`, `property`
- **Resource Management**: Always call `freepeer()` when done

#### Live Object Model
- **Reference**: [Live Object Model Documentation](https://docs.cycling74.com/apiref/lom/)
- **Purpose**: Defines the structure and properties of Live objects
- **Usage**: Reference for understanding what properties and methods are available
- **Examples**: Track properties, device parameters, clip attributes

#### Export Patterns and Module Loading
**Important**: M4LLib uses a dual export pattern to support both Max for Live and Node.js environments.

**Max for Live Environment**:
- Uses `global.M4LLibErrors` and `global.M4LLib` for global availability
- Supports `exports = M4LLib` pattern for compatibility
- Library is designed to work within Max's JavaScript environment

**Node.js Environment**:
- Uses `module.exports` for CommonJS compatibility
- Supports standard Node.js module loading

**Implementation Example**:
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

**Usage in Max for Live**:
- Include `m4l-errors.js` before `pdm.m4l.lib.js`
- Access functions directly: `M4LLib.getThisTrackId()`
- Access error classes: `M4LLibErrors.ErrorHandler.handle()`

### 3. Function Categories and Use Cases

#### ID Management Functions
**When to use**: Always needed when working with Live API objects
- `conformId(id)` - Convert various ID formats to numeric
- `validateId(id)` - Check if ID is valid numeric format
- `prefixId(id)` - Add "id " prefix for LiveAPI constructor
- `getIdFromPath(path)` - Extract ID from Live API path
- `getIdFromObject(object)` - Get ID from LiveAPI object

#### MIDI Operations
**When to use**: Creating, modifying, or managing MIDI clips and notes
- `createNewEmptyMidiClip(length, clipSlotId)` - Create empty MIDI clips
- `addNotesToClip(clip, notes)` - Add notes to existing clips
- `dumpNoteToNextEmptyClipForTrack(trackId, notes, clipName)` - Create clips with notes

#### Track Management
**When to use**: Working with Live tracks, clip slots, and scenes
- `getThisTrackId()` - Get current device's track ID
- `getNextEmptyClipSlotIdForTrack(trackId)` - Find empty clip slots
- `createNewEmptyClipSlotForTrack(trackId)` - Create new clip slots

#### Device Control
**When to use**: Navigating and controlling Live devices
- `getThisDeviceId()` - Get current device ID
- `navigateToDevice(deviceId)` - Focus device view

#### Utilities
**When to use**: General utility operations
- `defer(fn, context, args, delay)` - Schedule delayed execution

### 4. Common Use Case Patterns

#### "I want to create a MIDI clip with notes"
**Recommended functions**: `dumpNoteToNextEmptyClipForTrack()`
**Alternative approach**: `createNewEmptyMidiClip()` + `addNotesToClip()`
**Example**:
```javascript
const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
const success = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notes, "My Clip");
```

#### "I need to find an empty clip slot"
**Recommended functions**: `getNextEmptyClipSlotIdForTrack()`
**Alternative approach**: `createNewEmptyClipSlotForTrack()`
**Example**:
```javascript
const emptySlotId = M4LLib.getNextEmptyClipSlotIdForTrack(trackId);
```

#### "I want to work with the current device/track"
**Recommended functions**: `getThisDeviceId()`, `getThisTrackId()`
**Example**:
```javascript
const deviceId = M4LLib.getThisDeviceId();
const trackId = M4LLib.getThisTrackId();
```

#### "I need to convert an ID format"
**Recommended functions**: `conformId()`
**Example**:
```javascript
const numericId = M4LLib.conformId("id 123"); // Returns: 123
const numericId2 = M4LLib.conformId(["id", 456]); // Returns: 456
```

### 5. Function Parameter Requirements

#### ID Parameters
- Most functions expect **numeric IDs** (e.g., `123`)
- Use `conformId()` to convert string formats like `"id 123"`
- Use `prefixId()` when passing to LiveAPI constructor

#### Notes Object Structure
```javascript
{
    notes: [
        {
            pitch: 60,        // MIDI note number (0-127)
            start_time: 0,    // Start time in beats
            duration: 1,      // Duration in beats
            velocity: 100     // Velocity (0-127)
        }
    ]
}
```

#### Clip Length
- Must be positive number
- Represents length in beats
- Common values: 1, 2, 4, 8, 16

### 6. Error Handling Patterns

#### Always Use Try-Catch
```javascript
try {
    const result = M4LLib.someFunction();
} catch (error) {
    post('Error: ', error.message, '\n');
}
```

#### Common Error Scenarios
- **Invalid ID**: Use `conformId()` to fix
- **Track can't have MIDI**: Check if track supports MIDI
- **Live API errors**: Ensure Live is running and objects exist

### 7. Best Practices

#### ID Management
- Always use numeric IDs internally
- Convert IDs at boundaries (input/output)
- Validate IDs before use with `validateId()`

#### Resource Management
- Always call `freepeer()` on LiveAPI objects
- Use try-catch-finally for cleanup
- Handle errors gracefully

#### Performance
- Use `defer()` for operations that can't run immediately
- Batch operations when possible
- Avoid creating unnecessary LiveAPI objects

### 8. Common Development Patterns

#### Creating a MIDI Clip Generator
```javascript
function createMidiClip(trackId, notes, clipName) {
    try {
        return M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notes, clipName);
    } catch (error) {
        post('Failed to create clip: ', error.message, '\n');
        return false;
    }
}
```

#### Finding and Using Empty Clip Slots
```javascript
function findEmptySlot(trackId, startIndex = 0) {
    try {
        return M4LLib.getNextEmptyClipSlotIdForTrack(trackId, startIndex);
    } catch (error) {
        post('No empty slots found: ', error.message, '\n');
        return null;
    }
}
```

#### Working with Current Context
```javascript
function getCurrentContext() {
    try {
        return {
            deviceId: M4LLib.getThisDeviceId(),
            trackId: M4LLib.getThisTrackId()
        };
    } catch (error) {
        post('Failed to get context: ', error.message, '\n');
        return null;
    }
}
```

### 9. Troubleshooting Guide

#### "Function returns null/false"
- Check if parameters are valid
- Ensure Live objects exist
- Verify track supports MIDI operations

#### "ID validation fails"
- Use `conformId()` to convert formats
- Check if ID is numeric
- Verify object exists in Live

#### "Live API errors"
- Ensure Ableton Live is running
- Check if target objects exist
- Verify Live API paths are correct

### 10. GPT Response Templates

### 11. Max JavaScript Environment Considerations

#### When Suggesting Solutions
Always consider the Max JavaScript environment limitations:

1. **Timing and Scheduling**
   - ❌ Don't suggest: `setTimeout()`, `setInterval()`
   - ✅ Do suggest: `M4LLib.defer()`, `new Task()`, `defer` object

2. **Asynchronous Operations**
   - ❌ Don't suggest: `async/await`, `Promise`, `fetch`
   - ✅ Do suggest: Callbacks, Max's event system, `live.observer`

3. **Console Output**
   - ❌ Don't suggest: `console.log()`, `console.error()`
   - ✅ Do suggest: `post()`, `error()`, `cpost()`

4. **Data Storage**
   - ❌ Don't suggest: `localStorage`, `sessionStorage`
   - ✅ Do suggest: `Dict` objects, Max's `dict` object, file I/O

5. **Network Operations**
   - ❌ Don't suggest: `fetch()`, `XMLHttpRequest`
   - ✅ Do suggest: Max's `udpsend`, `tcpclient`, `http` objects

#### Common Max Patterns to Suggest

**Task Scheduling**:
```javascript
// Instead of setTimeout
const task = new Task(function() {
    post('This runs after delay\n');
}, null, []);
task.schedule(1000); // 1 second delay

// Or use M4LLib.defer
M4LLib.defer(() => {
    post('This runs after delay\n');
}, null, [], 1000);
```

**Message Passing**:
```javascript
// Instead of custom events
messnamed('myObject', 'bang'); // Send bang to named object
```

**Data Storage**:
```javascript
// Instead of localStorage
const myDict = new Dict('myData');
myDict.set('key', 'value');
// Later retrieve with myDict.get('key')
```

**Error Handling**:
```javascript
// Instead of console.error
error('Error message here\n');
```

#### Function Recommendation
```
Based on your description, I recommend using [FUNCTION_NAME] for this task.

**Function**: `M4LLib.[FUNCTION_NAME](parameters)`
**Purpose**: [Brief description]
**Parameters**: [Parameter list with types]
**Returns**: [Return value description]

**Example**:
```javascript
[Code example]
```

**Alternative approaches**:
- [Other functions that might work]
- [When to use alternatives]
```

#### Error Resolution
```
It looks like you're encountering a [ERROR_TYPE] error. Here's how to resolve it:

**Problem**: [Error description]
**Solution**: [Step-by-step solution]
**Prevention**: [How to avoid in future]

**Code example**:
```javascript
[Corrected code]
```
```

#### Best Practice Suggestion
```
For this use case, here are some best practices:

1. **Input Validation**: [Validation approach]
2. **Error Handling**: [Error handling pattern]
3. **Resource Management**: [Cleanup approach]
4. **Performance**: [Performance considerations]

**Recommended pattern**:
```javascript
[Best practice code example]
```
```

## Training Instructions

### For ChatGPT/Claude
1. **Copy the entire content** of this guide
2. **Set the context** as "You are an expert on M4LLib, a Max for Live utility library"
3. **Provide examples** of how you want responses formatted
4. **Test with sample questions** to refine responses

### For Custom GPT
1. **Upload this document** as training material
2. **Set system prompt** to act as M4LLib expert
3. **Configure response style** to be helpful and educational
4. **Add conversation starters** for common use cases

### For Fine-tuning
1. **Create Q&A pairs** based on this guide
2. **Include code examples** and explanations
3. **Cover edge cases** and error scenarios
4. **Test with real user questions**

## 📝 Example Training Questions

### Basic Questions
- "How do I create a MIDI clip?"
- "What function should I use to get the current track ID?"
- "How do I convert an ID string to a number?"

### Use Case Questions
- "I want to build a MIDI clip generator"
- "I need to find empty clip slots in a track"
- "I want to navigate to a specific device"

### Problem-Solving Questions
- "My function is returning null, what's wrong?"
- "I'm getting an ID validation error"
- "How do I handle Live API errors?"

### Advanced Questions
- "What's the best way to batch MIDI operations?"
- "How can I optimize performance for many clips?"
- "What's the recommended error handling pattern?"

## 🔄 Maintenance

### Regular Updates
- **Add new functions** as they're added to the library
- **Update examples** based on user feedback
- **Expand use cases** for common scenarios
- **Refine error handling** patterns

### User Feedback
- **Collect questions** that stump the GPT
- **Identify gaps** in training data
- **Update patterns** based on real usage
- **Add troubleshooting** for common issues

---

**Remember**: The goal is to make users productive with M4LLib as quickly as possible!
