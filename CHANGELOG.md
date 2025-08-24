# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project structure and documentation
- Core M4LLib class with static methods
- Comprehensive documentation with examples
- ID handling utilities and validation methods
- MIDI clip management functions
- Track and device management utilities
- Task scheduling and deferral functionality

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [0.0.1] - 2025-08-23

### Added
- **Core Library**: Complete M4LLib class with static methods
- **ID Management**: Utilities for handling Live API IDs consistently
- **MIDI Operations**: Functions for creating and managing MIDI clips
- **Track Management**: Methods for working with Live tracks and clip slots
- **Device Navigation**: Utilities for focusing and selecting devices
- **Error Handling**: Comprehensive error checking and validation
- **Documentation**: Complete API reference and usage examples
- **Task Scheduling**: Defer function execution using Max's Task system

### Features
- `getThisDeviceId()` - Get current device ID
- `getThisTrackId()` - Get current track ID
- `dumpNoteToNextEmptyClipForTrack()` - Create clips with notes
- `createNewEmptyMidiClip()` - Create empty MIDI clips
- `addNotesToClip()` - Add notes to existing clips
- `getNextEmptyClipSlotIdForTrack()` - Find empty clip slots
- `navigateToDevice()` - Focus device view
- `conformId()` - Normalize ID formats
- `defer()` - Schedule delayed function execution

### Technical Details
- Consistent ID handling convention (numeric IDs)
- Comprehensive input validation
- Memory management with proper `freepeer()` calls
- JSDoc documentation for all methods
- Error handling with descriptive messages

## [0.0.2] - 2025-08-24

### Added
- HTML API reference

### Changed
- Reorganized project structure


### Deprecated
- N/A

### Removed