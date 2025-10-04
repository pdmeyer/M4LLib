# M4LLib

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.0.2-blue.svg)](https://github.com/pdmeyer/M4LLib/releases)

**M4LLib** is a utility library for Max for Live (M4L) operations. It aims to provide an easy-to-use interface to Ableton Live's Live API by defining common patterns in a single library of functions.

**Please note** this library is a work in progress and is not yet ready for production use.

## Documentation
Please see the [documentation](resources/pdm.m4l.lib.api-documentation.md) for a reference of the library's functions and a usage guide.

## Quick Start

### Prerequisites

- **Ableton Live** (version 12 or later)
- Basic understanding of JavaScript in Max

### Installation

1. **Clone** this repository (if you don't know what this means, scroll down)
2. **Copy** `lib/pdm.m4l.lib.js` to your Max for Live project OR to anywhere in your Max search path (e.g. ~/Documents/Max 9/Library/)
3. **Add Javascript** to your device using `v8`, `v8ui`, or `v8.codebox`
4. **Include** the library in your device using `require("pdm.m4l.lib.js")`

### Basic Usage

```javascript
// Include the library in your Max for Live JavaScript object
const M4LLib = require("pdm.m4l.lib.js");

// Example: Get current device and track IDs
function bang() {
    const deviceId = M4LLib.getThisDeviceId();
    post('Device ID: ', deviceId, '\n');

    const trackId = M4LLib.getThisTrackId();
    post('Track ID: ', trackId, '\n');
}

// Example: Create a MIDI clip with notes
function createClip() {
    const trackId = M4LLib.getThisTrackId();
    const notes = {
        notes: [
            { pitch: 60, start_time: 0, duration: 1, velocity: 100 },
            { pitch: 64, start_time: 1, duration: 1, velocity: 90 },
            { pitch: 67, start_time: 2, duration: 1, velocity: 95 }
        ]
    };
    
    const success = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notes, "My Melody");
    if (success) {
        post('MIDI clip created successfully!\n');
    }
}
```

## Documentation

- **[API Documentation](resources/pdm.m4l.lib.documentation.md)** - Complete method reference
- **[Usage Examples](resources/pdm.m4l.lib.documentation.md#usage-examples)** - Practical code samples
- **[Best Practices](resources/pdm.m4l.lib.documentation.md#best-practices)** - Development guidelines

## Core Methods

### ID Management
- `conformId(id)` - Normalize various ID formats
- `validateId(id)` - Check ID validity
- `prefixId(id)` - Add "id " prefix for LiveAPI

### MIDI Operations
- `createNewEmptyMidiClip(length, clipSlotId)` - Create empty MIDI clips
- `addNotesToClip(clip, notes)` - Add notes to existing clips
- `dumpNoteToNextEmptyClipForTrack(trackId, notes, clipName)` - Create clips with notes

### Track Management
- `getThisTrackId()` - Get current track ID
- `getNextEmptyClipSlotIdForTrack(trackId)` - Find empty clip slots
- `createNewEmptyClipSlotForTrack(trackId)` - Create new clip slots

### Device Control
- `getThisDeviceId()` - Get current device ID
- `navigateToDevice(deviceId)` - Focus device view

### Utilities
- `defer(fn, context, args, delay)` - Schedule delayed execution

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## Reporting Issues

Found a bug or have a feature request? Please [open an issue](https://github.com/pdmeyer/M4LLib/issues) and include:

- **Description** of the problem
- **Steps** to reproduce
- **Expected** vs actual behavior
- **Environment** details (Max version, Live version, OS)

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT License is one of the most permissive open source licenses, allowing you to:
- Use the code commercially
- Modify the code
- Distribute the code
- Use it privately
- Sublicense the code