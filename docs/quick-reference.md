# M4LLib Quick Reference

## Common Operations

## Max JavaScript Environment

**Important**: M4LLib runs in Max for Live, not browser/Node.js!

- **NO `setTimeout`** → Use `M4LLib.defer()` or `new Task()`
- **NO `console.log`** → Use `post()`, `error()`, `cpost()`
- **NO `async/await`** → Use callbacks or Max's defer system
- **NO `localStorage`** → Use `Dict` objects for data storage
- **NO `fetch`** → Use Max's network objects (`udpsend`, `tcpclient`, `http`)

**References**:
- [Max JavaScript API](https://docs.cycling74.com/apiref/js/)
- [LiveAPI Class](https://docs.cycling74.com/apiref/js/liveapi/)
- [Live Object Model](https://docs.cycling74.com/apiref/lom/)

### Get Current Context
```javascript
const deviceId = M4LLib.getThisDeviceId();
const trackId = M4LLib.getThisTrackId();
```

### Create MIDI Clip with Notes
```javascript
const notes = { 
    notes: [{ 
        pitch: 60,        // C4
        start_time: 0,    // Start at beat 0
        duration: 1,      // 1 beat long
        velocity: 100     // Full velocity
    }] 
};

const success = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notes, "My Clip");
```

### Find Empty Clip Slot
```javascript
const emptySlotId = M4LLib.getNextEmptyClipSlotIdForTrack(trackId);
```

### Convert ID Formats
```javascript
const numericId = M4LLib.conformId("id 123");     // Returns: 123
const prefixedId = M4LLib.prefixId(123);          // Returns: "id 123"
```

## Function Categories

| Category | Functions | Use When |
|----------|-----------|----------|
| **ID Management** | `conformId()`, `validateId()`, `prefixId()` | Working with Live API IDs |
| **MIDI Operations** | `createNewEmptyMidiClip()`, `addNotesToClip()` | Creating/managing MIDI |
| **Track Management** | `getThisTrackId()`, `getNextEmptyClipSlotIdForTrack()` | Working with tracks |
| **Device Control** | `getThisDeviceId()`, `navigateToDevice()` | Controlling devices |
| **Utilities** | `defer()`, `getIdFromPath()` | General operations |

## Error Handling Pattern

```javascript
try {
    const result = M4LLib.someFunction();
    return result;
} catch (error) {
    M4LLibErrors.ErrorHandler.handle(error, 'functionName', false);
    return null;
}
```

## Notes Object Structure

```javascript
{
    notes: [
        {
            pitch: 60,        // MIDI note (0-127)
            start_time: 0,    // Start in beats
            duration: 1,      // Length in beats
            velocity: 100     // Velocity (0-127)
        }
    ]
}
```

## Resource Management

### Old Way (Manual Cleanup)
```javascript
let liveApi = null;
try {
    liveApi = new LiveAPI('some_path');
    // Use liveApi
} catch (error) {
    // Handle error
} finally {
    if (liveApi) liveApi.freepeer();
}
```

### New Way (RAII Pattern)
```javascript
// Get a track property
const trackName = M4LLib.withLiveAPI(trackId, (track) => {
    return track.get('name');
});

// Set a device parameter
M4LLib.withLiveAPI(deviceId, (device) => {
    device.set('parameters 0', 0.5);
});

// Call a song method
M4LLib.withLiveAPI('live_set', (song) => {
    song.call('create_scene', -1);
});

// Work with any Live object
const viewInfo = M4LLib.withLiveAPI('live_app view', (view) => {
    return view.get('focused_view');
});
```

**Benefits**:
- Automatic cleanup with `freepeer()`
- Cleaner, more readable code
- No risk of memory leaks
- Consistent error handling
- Automatic ID format conversion (numeric → "id N" for LiveAPI)

## Common Use Cases

### MIDI Clip Generator
```javascript
function generateClip(trackId, notePattern, clipName) {
    try {
        return M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notePattern, clipName);
    } catch (error) {
        M4LLibErrors.ErrorHandler.handle(error, 'generateClip', false);
        return false;
    }
}
```

### Find Empty Slots
```javascript
function findEmptySlots(trackId, count = 1) {
    const slots = [];
    let startIndex = 0;
    
    for (let i = 0; i < count; i++) {
        try {
            const slotId = M4LLib.getNextEmptyClipSlotIdForTrack(trackId, startIndex);
            slots.push(slotId);
            startIndex = Math.floor(slotId / 2) + 1;
        } catch (error) {
            break; // No more empty slots
        }
    }
    
    return slots;
}
```

## Common Pitfalls

1. **Always use try-catch** around M4LLib functions
2. **Convert IDs** with `conformId()` before using
3. **Clean up resources** with `freepeer()` in finally blocks
4. **Validate inputs** before calling functions
5. **Handle errors gracefully** with fallbacks

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Function returns null | Check parameters and Live object existence |
| ID validation fails | Use `conformId()` to convert formats |
| Live API errors | Ensure Live is running and objects exist |
| Memory issues | Check `freepeer()` usage in finally blocks |

## Need Help?

- **Documentation**: See `docs/` folder for detailed guides
- **Examples**: Check `examples/` folder for working code
- **Error Handling**: Use `docs/error-handling-guide.md`
- **GPT Training**: Use `docs/gpt-training-guide.md` for AI assistance

---

**Remember**: Always wrap M4LLib calls in try-catch blocks! 🎵
