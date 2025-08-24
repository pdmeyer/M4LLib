# M4LLib Library Documentation
## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [General Guidelines](#general-guidelines)
4. [Class Reference](#class-reference)
5. [Method Reference](#method-reference)
6. [Usage Examples](#usage-examples)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)

## Overview

**M4LLib** is a library of helpful functions built upon the Live API for interacting with Ableton Live's API within Max for Live devices. This library simplifies common operations like managing MIDI clips, tracks, and clip slots.

## Installation & Setup

### Prerequisites
- Max for Live (M4L) environment
- Ableton Live (version 10 or later recommended)
- Basic understanding of JavaScript in Max

### Integration
Include the library in your Max for Live device:

```javascript
// In your Max for Live JavaScript object
const M4LLib = require("pdm.m4l.lib.js")M4LLib;

// example of getting this device's ID in response to a bang
function bang() {
    const deviceId = M4LLib.getThisDeviceId();
    post('this device id: ', deviceId, '\n');

    const trackId = M4LLib.getThisTrackId();
    post('this track id: ', trackId, '\n');
}
```

## General Guidelines

#### ID Handling Convention

This library follows a consistent ID handling convention where all Live objects are represented by their numeric ID values, not by the "id {number}" string format.

- **Input**: Functions expect numeric IDs (e.g., `123`) rather than prefixed strings (e.g., `"id 123"`)
- **Output**: Functions return numeric IDs (e.g., `123`) rather than prefixed strings
- **Conversion**: Use utility methods to convert between different ID formats

#### ID Conversion Utilities

`M4LLib.conformId(id)`
Converts various ID formats to the standard numeric format:
```javascript
M4LLib.conformId("id 123");     // Returns: 123
M4LLib.conformId(123);          // Returns: 123
M4LLib.conformId(["id", 123]);  // Returns: 123
M4LLib.conformId([123]);        // Returns: 123
```

`M4LLib.getIdFromPath(path)`
Extracts numeric ID from a Live API path:
```javascript
const trackId = M4LLib.getIdFromPath('live_set tracks 0');
// Returns: 456 (numeric ID, not "id 456")
```

`M4LLib.validateId(id)`
Validates that an ID is in the correct numeric format:
```javascript
if (M4LLib.validateId(trackId)) {
    // ID is valid numeric format
    const clip = M4LLib.createNewEmptyMidiClip(4, trackId);
}
```

#### `M4LLib.prefixId(id)`
Converts the Id to a string with the "id " prefix. Used _only_ when passing the ID into the LiveAPI constructor.
```javascript
const thisDeviceId = M4LLib.getThisDeviceId();
const thisDevice = new LiveAPI(M4LLib.prefixId(thisDeviceId));
thisDevice.freepeer();
```

#### Examples of Correct Usage

When working with Live objects, always use their numeric IDs:

```javascript
// ✅ Correct - Use numeric IDs
const trackId = M4LLib.getThisTrackId();        // Returns: 123
const clipId = M4LLib.createNewEmptyMidiClip(4, trackId);  // Expects: 123

// ❌ Incorrect - Don't use prefixed strings
const trackId = "id 12";
const clipId = M4LLib.createNewEmptyMidiClip(4, trackId);  // Will cause errors

// ✅ Correct - For IDs already in string format, convert them first with M4LLib.conformId()
const trackId = "id 12";
const trackIdNum = M4LLib.conformId(trackId);
const clipId = M4LLib.createNewEmptyMidiClip(4, trackIdNum);
```

### Deferred Execution for Notifications

Ableton Live restricts certain operations from being triggered directly by notifications or UI events. When this happens, you will see the error `Changes cannot be triggered by notifications. You will need to defer your response.` in the Max Console. This means that you must move the execution of your function to a lower-priority thread. This can be accomplished using the `M4LLib.defer()`, which makes use of Max's Task system to schedule the function with a delay (usually 0 ms).

#### When to Use `defer()`

Don't use it, until you see the `You will need to defer your reponse` error in the Max console. Then, use it to move the execution of your function to a lower-priority thread.

#### How to use `defer()`
The `defer()` function takes a function reference as its first argument, and then the context and arguments to pass to the function.

```javascript
M4LLib.defer(function() {
    post("This runs in a lower priority thread\n");
}, this, [arg1, arg2], 0);
```

In almost all cases, the context will be `this`. The array of arguments in the third position is optional and are the arguments to pass into the function. The fourth (optional) argument is the delay in milliseconds before the function is executed. By default, the delay is 0 ms.

Refer to the defer() reference below for more details.

#### Example Usage

```javascript
// ❌ This will cause an error when called from a notification
function handleNotification() {
    M4LLib.createNewEmptyMidiClip(4, trackId); // Error!
}

// ✅ Use defer() to avoid the error - pass function reference directly
function handleNotification() {
    M4LLib.defer(M4LLib.createNewEmptyMidiClip, this, [4, trackId]);
}
```

## API Reference

For the complete API reference with all methods, parameters, and return types, see:

- **[API.md](API.md)** - Markdown format API reference
- **[HTML API Documentation](api/index.html)** - Beautiful, searchable HTML documentation with the clean-jsdoc-theme

The API reference includes:
- All public methods with detailed parameter descriptions
- Return types and error conditions
- Code examples for each method
- Clean, focused documentation without extraneous error class details

This documentation focuses on usage examples, best practices, and tutorials rather than API details.

## Usage Examples

### Basic Workflow: Creating and Populating a MIDI Clip

```javascript
// 1. Get current track ID
const trackId = M4LLib.getThisTrackId();

// 2. Define notes
const notes = {
    notes: [
        { pitch: 60, start_time: 0, duration: 1, velocity: 100 },  // C4
        { pitch: 64, start_time: 1, duration: 1, velocity: 90 },   // E4
        { pitch: 67, start_time: 2, duration: 1, velocity: 95 },   // G4
        { pitch: 72, start_time: 3, duration: 1, velocity: 85 }    // C5
    ]
};

// 3. Create clip and add notes
const clipId = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notes, "C Major Arpeggio");
```

### Advanced: Managing Multiple Clips

```javascript
// Create multiple clips in sequence
const trackId = M4LLib.getThisTrackId();

// Clip 1: Bass line
const bassNotes = {
    notes: [
        { pitch: 36, start_time: 0, duration: 2, velocity: 100 },  // C2
        { pitch: 36, start_time: 2, duration: 2, velocity: 90 }    // C2
    ]
};
const bassClipId = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, bassNotes, "Bass");

// Clip 2: Melody
const melodyNotes = {
    notes: [
        { pitch: 60, start_time: 0, duration: 0.5, velocity: 100 }, // C4
        { pitch: 62, start_time: 0.5, duration: 0.5, velocity: 90 }, // D4
        { pitch: 64, start_time: 1, duration: 1, velocity: 95 }      // E4
    ]
};
const melodyClipId = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, melodyNotes, "Melody");
```

### Error Handling Example

```javascript
try {
    const trackId = M4LLib.getThisTrackId();
    const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
    
    const clipId = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notes, "Test Clip");
    
    if (clipId) {
        post("Successfully created clip with ID: " + clipId + "\n");
    } else {
        post("Failed to create clip\n");
    }
} catch (error) {
    post("Error: " + error.message + "\n");
}
```

## Error Handling

The library includes comprehensive error checking and will throw descriptive error messages for common issues:

- **Invalid track operations**: Attempting MIDI operations on non-MIDI tracks
- **Malformed data**: Incorrect notes object structure
- **Path parsing errors**: Invalid Live API paths
- **Resource access failures**: Unable to access Live API objects

## Best Practices

### 1. Resource Management
Always call `freepeer()` on LiveAPI objects when done with them to prevent memory leaks:

```javascript
const track = new LiveAPI(trackId);
// ... use track object
track.freepeer(); // Clean up
```

### 2. Error Handling
Wrap library calls in try-catch blocks for robust error handling:

```javascript
try {
    const result = M4LLib.someMethod();
} catch (error) {
    post("Library error: " + error.message + "\n");
}
```

### 3. Notes Object Structure
Always use the correct notes object structure:

```javascript
// ✅ Correct
const notes = { notes: [noteObject1, noteObject2] };

// ❌ Incorrect
const notes = [noteObject1, noteObject2];
```

### 4. ID Handling
Use the library's ID conversion methods for consistent ID handling:

```javascript
// ✅ Use library method
const normalizedId = M4LLib.conformId(userInput);

// ❌ Don't assume ID format
const id = "id " + userInput; // May cause errors
```

### 5. ID Validation
Always validate IDs before using them with library functions:

```javascript
// ✅ Validate before use
if (M4LLib.validateId(trackId)) {
    const clip = M4LLib.createNewEmptyMidiClip(4, trackId);
}

// ❌ Don't assume ID is valid
const clip = M4LLib.createNewEmptyMidiClip(4, trackId); // May fail
```

## Notes Object Structure

Each note in the notes array should have the following properties:

```javascript
{
    pitch: number,        // MIDI note number (0-127)
    start_time: number,   // Start time in beats
    duration: number,     // Duration in beats
    velocity: number      // MIDI velocity (0-127)
}
```

## Version History

- **1.0.0**: Initial release with core functionality
  - Track management
  - MIDI clip operations
  - Clip slot management
  - Utility methods

## Support & Contributing

For issues, questions, or contributions, please refer to the project documentation or create an issue in the project repository.

---
