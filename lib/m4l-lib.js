/**
 * M4LLib - A utility library for Max for Live (M4L) operations
 * 
 * This class provides static methods for interacting with Ableton Live's API,
 * managing MIDI clips, tracks, and clip slots. It handles common operations
 * like creating MIDI clips, adding notes, and managing track resources.
 * 
 * @since 1.0.0
 */

// Import error handling system using Max for Live require
const M4LLibErrors = require('./m4l-errors.js');

"use strict";

class M4LLib {
    /**
     * Creates a new M4LLib instance
     * Note: This class contains only static methods and is not meant to be instantiated
     * 
     * @constructor
     * @throws {Error} Always throws an error - this class cannot be instantiated
     */
    constructor() {
        throw new Error('M4LLib is a utility class and cannot be instantiated. Use static methods directly: M4LLib.methodName()');
    }

    // ========================================================================
    // DEVICE MANAGEMENT
    // ========================================================================

    /**
     * Gets the ID of the current device
     * 
     * @static
     * @returns {number|null} The device ID, or null if the operation fails
     * @throws {M4LLibError} If the operation fails
     */
    static getThisDeviceId() {
        const id = this.getIdFromPath('this_device');
        return id;
    }

    /**
     * Gets the track ID of the current device's track
     * 
     * @static
     * @returns {number|null} The track ID, or null if the operation fails
     * @throws {M4LLibError} If unable to access the current device or track or if the operation fails
     * 
     * @example
     * const trackId = M4LLib.getThisTrackId();
     * // Returns: "id 123"
     */
    static getThisTrackId() {
        let lapi = new LiveAPI('live_set this_device');
        const track_path = lapi.path.split(' ').slice(0, 3);
        lapi.freepeer();
        lapi = new LiveAPI(track_path);
        const track_id = lapi.id;
        lapi.freepeer();
        return track_id;
    }

    /**
     * Navigates to the device view
     * 
     * @static
     * @returns {boolean} True if the navigation was successful, false otherwise
     * @throws {M4LLibError} If device ID is invalid, navigation fails, or the operation fails
     */
    static navigateToDevice(deviceId) {
        const methodName = 'M4LLib.navigateToDevice';
        let view = null;
        let setView = null;

        try {
            this.validateId(deviceId, methodName);
            view = new LiveAPI('live_app view');
            view.call('focus_view', 'Detail/DeviceChain');

            setView = new LiveAPI('live_set view');
            setView.call('select_device', 'id', deviceId);

            return true;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return false;
        } finally {
            // Always clean up LiveAPI objects
            if (view) view.freepeer();
            if (setView) setView.freepeer();
        }
    }

    /**
     * Gets the names of the parameters for a device
     * 
     * @static
     * @param {string|number} deviceId - The ID of the device to get the parameters for
     * @returns {Array} An object containing all the parameters in the form of  {name: string, id: number} objects
     */
    static getDeviceParameterNames(deviceId) {
        const methodName = 'M4LLib.getDeviceParameterNames';
        try {
            this.validateId(deviceId, methodName);
            const device = new LiveAPI(this.prefixId(deviceId));
            const parameterIds = device.get('parameters');
            device.freepeer();
            const parameterNames = this.iterateIds(parameterIds, (id) => {
                const parameter = new LiveAPI(this.prefixId(id));
                const name = parameter.get('name')[0];
                parameter.freepeer();
                return [id, name];
            });
            const namesObj = {};
            parameterNames.forEach(([id, name]) => {
                namesObj[name] = {
                    name: name,
                    id: id
                };
            });
            return namesObj;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        }
    }

    /**
     * Gets the names of the parameters for a device
     * 
     * @static
     * @param {string|number} deviceId - The ID of the device to get the parameters for
     * @returns {Array} An array of ids
     */
    static getDeviceParameters(deviceId) {
        const methodName = 'M4LLib.getDeviceParameterNames';
        try {
            this.validateId(deviceId, methodName);
            const device = new LiveAPI(this.prefixId(deviceId));
            const parameterIds = device.get('parameters');
            device.freepeer();
            return this.iterateIds(parameterIds, (id) => {
                const parameter = new LiveAPI(this.prefixId(id));
                const name = parameter.get('name')[0];
                parameter.freepeer();
                return id;
            });
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        }
    }

        /**
     * Gets the names of the parameters for a device
     * 
     * @static
     * @param {string|number} deviceId - The ID of the device to get the parameters for
     * @returns {Array} An object containing all the parameters and their info
     */
        static getDeviceParameterInfos(deviceId) {
            const methodName = 'M4LLib.getDeviceParameterNames';
        try {
            this.validateId(deviceId, methodName);
            const device = new LiveAPI(this.prefixId(deviceId));
            const parameterIds = device.get('parameters');
            device.freepeer();
            const parameterNames = this.iterateIds(parameterIds, (id) => {
                const parameter = new LiveAPI(this.prefixId(id));
                const name = parameter.get('name')[0];
                parameter.freepeer();
                return {
                    id: id, 
                    name: parameter.get('name')[0]
                    automation_state: parameter.get('automation_state')[0],
                };
            });
            const parameterInfo = {};
            parameterInfo.forEach(([id, name]) => {
                namesObj[name] = {
                    name: name,
                    id: id
                };
            });
            return namesObj;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        }
    }

    // ========================================================================
    // MIDI OPERATIONS
    // ========================================================================

    /**
     * Dumps notes to the next empty clip slot for a specified track
     * 
     * @static
     * @param {string|number} trackId - The track ID to create the clip in
     * @param {Object} notes - Object containing notes data with 'notes' key
     * @param {Array} notes.notes - Array of note objects to add to the clip
     * @returns {number|null} The ID of the created clip, or null if creation fails
     * @throws {M4LLibError} If track cannot have MIDI clips, notes format is invalid, any operation fails, or the operation fails
     *
     * 
     * @example
     * const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
     * const clipId = M4LLib.dumpNotesToNextEmptyClipForTrack(trackId, notes);
     */
    static dumpNotesToNextEmptyClipForTrack(trackId, notes, length = null) {
        const methodName = 'M4LLib.dumpNotesToNextEmptyClipForTrack';

        try {
            this.validateId(trackId, methodName);

            if (Array.isArray(notes)) {
                notes = { notes: notes };
            }

            let nextEmptyClipSlotId = this.getNextEmptyClipSlotIdForTrack(trackId);
            if (!nextEmptyClipSlotId) {
                const newSceneIx = this.createNewSceneAtBottom();
                const track = new LiveAPI(this.prefixId(trackId));
                const clipSlotPath = track.path + ' clip_slots ' + newSceneIx;
                track.freepeer();
                const clipSlot = new LiveAPI(clipSlotPath);
                nextEmptyClipSlotId = clipSlot.id;
                clipSlot.freepeer();
            }

            const clipLength = length || this.calculateClipLengthFromNotes(notes);
            const clipId = this.createNewEmptyMidiClip(clipLength, nextEmptyClipSlotId);
            if (!clipId) {
                throw new M4LLibErrors.M4LLibError(
                    'Failed to create new MIDI clip',
                    'MIDI_OPERATION_ERROR',
                    { trackId: trackId, clipSlotId: nextEmptyClipSlotId },
                    methodName
                );
            }
            const success = this.addNotesToClip(clipId, notes);
            if (!success) {
                throw new M4LLibErrors.M4LLibError(
                    'Failed to add notes to clip',
                    'MIDI_OPERATION_ERROR',
                    { clipId: clipId, notes: notes },
                    methodName
                );
            }
            return clipId;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        }
    }

    /**
     * Calculates the minimal clip length to contain all notes, min 1 beat.
     * 
     * @static
     * @param {Array} notes - Array of note objects
     * @returns {number} The minimal clip length
     * @throws {M4LLibError} If the notes parameter is invalid or the operation fails
     */
    static calculateClipLengthFromNotes(notes) {
        this.validateNotes(notes, 'M4LLib.calculateClipLengthFromNotes');
        notes = notes.notes;
        if (!Array.isArray(notes) || notes.length === 0) return 1;
        const sorted = [...notes].sort((a, b) => (a.start_time || 0) - (b.start_time || 0));
        const last = sorted[sorted.length - 1] || { start_time: 0, duration: 0 };
        const end = (last.start_time || 0) + Math.max(0, last.duration || 0);
        return end > 1 ? end : 1;
    };

    /**
     * Adds notes to an existing MIDI clip
     * 
     * @static
     * @param {string|number} clipId - The ID of the clip to add notes to
     * @param {Object} notes - Object containing notes data
     * @param {Array} notes.notes - Array of note objects to add
     * @returns {boolean} True if the notes were added to the clip, false otherwise
     * @throws {M4LLibError} If notes object format is invalid, clip ID is invalid or the operation fails
     * 
     * @example
     * const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
     * M4LLib.addNotesToClip(clipId, notes);
     */
    static addNotesToClip(clipId, notes) {
        const methodName = 'M4LLib.addNotesToClip';

        try {
            this.validateNotes(notes, methodName);

            // Validate inputs
            this.validateId(clipId, methodName);

            // Validate note structure
            if (notes.notes.length > 0) {
                const firstNote = notes.notes[0];
                const requiredFields = ['pitch', 'start_time', 'duration', 'velocity'];
                const missingFields = requiredFields.filter(field => !(field in firstNote));

                if (missingFields.length > 0) {
                    throw new M4LLibErrors.M4LLibError(
                        'Note objects must contain required fields: pitch, start_time, duration, velocity',
                        'VALIDATION_ERROR',
                        { missingFields, example: { pitch: 60, start_time: 0, duration: 1, velocity: 100 } },
                        methodName
                    );
                }
            }

            // Create and populate the Dict object
            let notesDict = null;
            let clip = null;
            try {
                notesDict = new Dict();
                notesDict.parse(JSON.stringify(notes));

                // Add notes to the clip
                clipId = this.prefixId(clipId);
                clip = new LiveAPI(clipId);
                clip.call('add_new_notes', notesDict);

                return true;
            } catch (liveApiError) {
                throw new M4LLibErrors.M4LLibError(
                    'Failed to add notes to clip via Live API',
                    'LIVE_API_ERROR',
                    {
                        originalError: liveApiError.message,
                        clipId: clip.id || 'unknown',
                        notesCount: notes.notes.length
                    },
                    methodName
                );
            } finally {
                // Always clean up the Dict object
                if (notesDict) {
                    notesDict.freepeer();
                }
                // Always clean up the clip object
                if (clip) {
                    clip.freepeer();
                }
            }

        } catch (error) {
            // Handle the error consistently
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return false;
        }
    }

    static validateNotes(notes, methodName) {
        if (!notes || typeof notes !== 'object') {
            throw new M4LLibErrors.M4LLibError(
                'Notes parameter must be an object',
                'VALIDATION_ERROR',
                { received: typeof notes, expected: 'object' },
                methodName
            );
        }

        const keys = Object.keys(notes);
        if (keys.length !== 1 || keys[0] !== 'notes') {
            throw new M4LLibErrors.M4LLibError(
                'Notes object must have exactly one key named "notes"',
                'VALIDATION_ERROR',
                { received: keys, expected: ['notes'] },
                methodName
            );
        }

        if (!Array.isArray(notes.notes)) {
            throw new M4LLibErrors.M4LLibError(
                'Notes.notes must be an array',
                'VALIDATION_ERROR',
                { received: typeof notes.notes, expected: 'array' },
                methodName
            );
        }
    }

    /**
     * Creates a new empty MIDI clip in a specified clip slot
     * 
     * @static
     * @param {number} length - The length of the clip in beats
     * @param {string|number} clipSlotId - The clip slot ID to create the clip in
     * @returns {number|null} The ID of the created clip, or null if creation fails
     * @throws {M4LLibError} If unable to get track path from clip slot path, clip creation fails, or the operation fails
     * 
     * @example
     * const clipId = M4LLib.createNewEmptyMidiClip(4, clipSlotId);
     * // Creates a 4-beat MIDI clip
     */
    static createNewEmptyMidiClip(length, clipSlotId) {
        const methodName = 'M4LLib.createNewEmptyMidiClip';
        let clipSlot = null;
        let clip = null;

        try {
            clipSlot = new LiveAPI(this.prefixId(clipSlotId));
            clipSlot.call('create_clip', length);
            clip = new LiveAPI(clipSlot.get('clip'));
            clip.set('loop_end', length);
            const id = clip.id;
            return id;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        } finally {
            // Always clean up LiveAPI objects
            if (clipSlot) clipSlot.freepeer();
            if (clip) clip.freepeer();
        }
    };

    // ========================================================================
    // TRACK & SCENE MANAGEMENT
    // ========================================================================

    /**
     * Extracts the track path from a full path string
     * 
     * @static
     * @param {string} path - The full path string (e.g., "live_set tracks 0 clip_slots 0")
     * @returns {string|null} The track path (e.g., "live_set tracks 0"), or null if invalid
     * @throws {M4LLibError} If path is not a string, doesn't contain expected structure, or the operation fails
     * 
     * @example
     * const trackPath = M4LLib.getTrackPathFromPath("live_set tracks 0 clip_slots 0");
     * // Returns: "live_set tracks 0"
     */
    static getTrackPathFromPath(path) {
        const methodName = 'M4LLib.getTrackPathFromPath';

        try {
            if (typeof path != 'string') {
                throw new M4LLibErrors.M4LLibError(
                    'Path parameter must be a string',
                    'VALIDATION_ERROR',
                    { received: typeof path, expected: 'string' },
                    methodName
                );
            }
            const pathParts = path.split(' ');
            if (pathParts[1] !== 'tracks') {
                throw new M4LLibErrors.M4LLibError(
                    'Invalid path structure. Expected "tracks" at position 1',
                    'VALIDATION_ERROR',
                    { received: pathParts[1], expected: 'tracks', fullPath: path },
                    methodName
                );
            }
            const trackPathParts = pathParts.slice(0, 3);
            return trackPathParts.join(' ');
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        }
    }

    /**
     * Creates a new empty clip slot for a specified track
     * 
     * @static
     * @param {string|number} trackId - The track ID to create the clip slot in
     * @returns {number|null} The ID of the created clip slot, or null if creation fails
     * @throws {M4LLibError} If track cannot have MIDI clips, clip slot creation fails, or the operation fails
     * 
     * @example
     * const clipSlotId = M4LLib.createNewEmptyClipSlotForTrack(trackId);
     */
    static createNewEmptyClipSlotForTrack(trackId) {
        const methodName = 'M4LLib.createNewEmptyClipSlotForTrack';
        let track = null;
        let liveset = null;
        let emptyClipSlot = null;

        try {
            this.validateId(trackId, methodName);
            track = new LiveAPI(trackId);
            const hasMidiInput = track.get('has_midi_input');
            if (!hasMidiInput) {
                throw new M4LLibErrors.M4LLibError(
                    'Track cannot have MIDI clips',
                    'TRACK_OPERATION_ERROR',
                    { trackId: trackId, hasMidiInput: hasMidiInput },
                    methodName
                );
            }

            liveset = new LiveAPI('live_set');
            liveset.call('create_scene', -1);
            const newSceneIndex = liveset.get('scenes').length / 2 - 1;

            const emptyClipSlotPath = 'live_set tracks ' + trackId + ' clip_slots ' + newSceneIndex;
            emptyClipSlot = new LiveAPI(emptyClipSlotPath);
            const id = emptyClipSlot.id;
            return id;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        } finally {
            // Always clean up LiveAPI objects
            if (track) track.freepeer();
            if (liveset) liveset.freepeer();
            if (emptyClipSlot) emptyClipSlot.freepeer();
        }
    }

    /**
     * Finds the next empty clip slot for a specified track
     * 
     * @static
     * @param {string|number} trackId - The track ID to search for empty clip slots
     * @param {number} [start_index=0] - The starting index to search from
     * @returns {number|null} The ID of the next empty clip slot, or null if none found
     * @throws {M4LLibError} If track ID is invalid or the track cannot have MIDI clips
     * 
     * @example
     * const emptySlotId = M4LLib.getNextEmptyClipSlotIdForTrack(trackId, 2);
     * // Starts searching from index 2
     */
    static getNextEmptyClipSlotIdForTrack(trackId, start_index = 0) {
        const methodName = 'M4LLib.getNextEmptyClipSlotIdForTrack';
        this.validateId(trackId, methodName);
        const track = new LiveAPI(this.prefixId(trackId));
        const hasMidiInput = track.get('has_midi_input');
        if (!hasMidiInput) {
            throw new M4LLibErrors.M4LLibError(
                'Track cannot have MIDI clips',
                'TRACK_OPERATION_ERROR',
                { trackId: trackId },
                methodName
            );
        }

        const clipSlots = track.get('clip_slots');
        track.freepeer();
        for (let i = start_index * 2 + 1; i < clipSlots.length; i += 2) {
            const id = this.prefixId(clipSlots[i]);
            const clipSlot = new LiveAPI(id);
            const hasClip = clipSlot.get('has_clip');
            if (hasClip == 0) {
                const emptySlotId = clipSlot.id;
                clipSlot.freepeer();
                return emptySlotId;
            }
            clipSlot.freepeer();
        }
        return null;
    };

    /**
     * Creates a new scene at the bottom of the scene list
     * 
     * @static
     * @returns {number|null} The index of the new scene, or null if creation fails
     * @throws {M4LLibError} If scene creation fails or the operation fails
     */
    static createNewSceneAtBottom() {
        const methodName = 'M4LLib.createNewSceneAtBottom';
        let liveset = null;
        try {
            liveset = new LiveAPI('live_set');
            liveset.call('create_scene', -1);
            const newSceneIndex = liveset.get('scenes').length / 2 - 1;
            return newSceneIndex;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        } finally {
            if (liveset) liveset.freepeer();
        }
    }

    // ========================================================================
    // ID & PATH UTILITIES
    // ========================================================================

    /**
     * Parses and normalizes various ID formats to a consistent format
     * 
     * @static
     * @param {string|number|Array} id - The ID to parse (can be string, number, or array)
     * @returns {number} The numeric ID
     * @throws {M4LLibError} If the id parameter is invalid, cannot be parsed, or the operation fails
     * 
     * @example
     * M4LLib.conformId("id 123");     // Returns: 123
     * M4LLib.conformId(123);          // Returns: 123
     * M4LLib.conformId(["id", 123]);  // Returns: 123
     * M4LLib.conformId([123]);        // Returns: 123
     */
    static conformId(id) {
        const methodName = 'M4LLib.conformId';

        // Handle null/undefined values explicitly
        if (id === null || id === undefined) {
            throw new M4LLibErrors.M4LLibError(
                'ID parameter cannot be null or undefined',
                'VALIDATION_ERROR',
                { received: id, expected: 'valid ID, string, or array' },
                methodName
            );
        }

        let numericId = null;
        if (typeof id == 'string') {
            if (id.startsWith('id ')) numericId = id.slice(3);
            else numericId = Number(id);
        } else if (typeof id == 'number') {
            numericId = id;
        } else if (Array.isArray(id)) {
            if (id[0] == 'id') numericId = id[1];
            else numericId = id[0];
        } else {
            // Throw error for unsupported types (like objects)
            throw new M4LLibErrors.M4LLibError(
                'ID parameter must be a string, number, or array',
                'VALIDATION_ERROR',
                { received: typeof id, value: id, expected: 'string, number, or array' },
                methodName
            );
        }

        // Validate that we got a valid numeric ID
        if (numericId === null || isNaN(numericId)) {
            throw new M4LLibErrors.M4LLibError(
                'Could not convert ID to a valid number',
                'VALIDATION_ERROR',
                { received: id, converted: numericId, expected: 'valid number' },
                methodName
            );
        }

        return numericId;
    }

    /**
     * Validates that an ID is a number
     * 
     * @static
     * @param {string|number|Array} id - The ID to validate
     * @param {string} methodName - The name of the calling method for error context
     * @throws {M4LLibError} If the id parameter is invalid or the operation fails
     */
    static validateId(id, methodName) {
        const numericValue = Number(id);
        if (isNaN(numericValue) || !isFinite(numericValue)) {
            throw new M4LLibErrors.M4LLibError(
                'ID must be a valid number',
                'VALIDATION_ERROR',
                { received: id, suggestion: 'Use M4LLib.conformId() to convert formats' },
                methodName
            );
        }
    }

    /**
     * Adds the "id " prefix to a numeric ID
     * 
     * @static
     * @param {number} numericId - The numeric ID to prefix
     * @returns {string} The ID with "id " prefix
     * @throws {M4LLibError} If the numericId parameter is not a number or the operation fails
     * 
     * @example
     * M4LLib.prefixId(123); // Returns: "id 123"
     */
    static prefixId(numericId) {
        return "id " + numericId;
    }

    /**
     * Gets the ID from a path
     * 
     * @static
     * @param {string} path - The path to get the ID from
     * @returns {number|null} The ID, or null if the operation fails
     * @throws {M4LLibError} If path is not a string or the operation fails
     */
    static getIdFromPath(path) {
        const methodName = 'M4LLib.getIdFromPath';
        let object = null;

        try {
            if (typeof path != 'string') {
                throw new M4LLibErrors.M4LLibError(
                    'Path parameter must be a string',
                    'VALIDATION_ERROR',
                    { received: typeof path, expected: 'string' },
                    methodName
                );
            }
            object = new LiveAPI(path);
            const id = Number(object.id);
            return id;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        } finally {
            // Always clean up LiveAPI objects
            if (object) object.freepeer();
        }
    }

    static getPathFromId(id) {
        const methodName = 'M4LLib.getPathFromId';
        return this.withLiveAPI(id, (object) => {
            return object.path;
        }, null, [], methodName);
    }

    /**
     * Gets the ID from a LiveAPI object
     * 
     * @static
     * @param {Object} object - The LiveAPI object to get the ID from
     * @returns {number} The ID of the object
     * @throws {M4LLibError} If the object parameter is invalid or the operation fails
     * 
     * @example
     * const track = new LiveAPI(trackId);
     * const id = M4LLib.getIdFromObject(track);
     * track.freepeer();
     */
    static getIdFromObject(object) {
        const id = object.id;
        return id;
    }

    /**
     * Gets the index of an item from a path
     * 
     * @static
     * @param {string} path - The path to get the item index from
     * @param {string} itemType - The type of item to get the index of
     * @returns {number} The index of the item
     * @throws {M4LLibError} If the item type is invalid or the operation fails
     * 
     * @example
     * const itemIndex = M4LLib.getItemIndexFromPath("live_set tracks 0", "tracks");
     * // Returns: 0
     */
    static getItemIndexFromPath(path, itemType) {
        const methodName = 'M4LLib.getItemIndexFromPath';
        const VALID_ITEM_TYPES = ["tracks", "scenes", "clip_slots", "cue_points", "return_tracks", "arrangement_clips", "grooves", "control_surfaces", "return_chains", "chains", "devices", "drum_pads", "audio_inputs", "audio_outputs", "midi_inputs", "midi_outputs", "parameters"];
        if (!VALID_ITEM_TYPES.includes(itemType)) {
            throw new M4LLibErrors.M4LLibError(
                'Invalid item type. Must be one of: ' + VALID_ITEM_TYPES.join(', '),
                'VALIDATION_ERROR',
                { received: itemType, expected: 'valid item type' },
                methodName
            );
        }

        const pathParts = path.split(' ');
        const itemIndex = pathParts.indexOf(itemType);

        if (itemIndex == -1) {
            throw new M4LLibErrors.M4LLibError(
                'Item type not found in path',
                'VALIDATION_ERROR',
                { received: itemType + " for path: " + path, expected: 'valid item type' },
                methodName
            );
        }
        return pathParts[itemIndex + 1];
    }

    // ========================================================================
    // UTILITY METHODS
    // ========================================================================

    /**
     * Schedules a function to be executed with a delay using Max's Task system.
     * This is useful for avoiding Ableton Live's restrictions on triggering certain operations
     * in response to notifications.
     * 
     * @static
     * @param {Function} fn - The function to execute
     * @param {Object} [context=null] - The context (this) to use when executing the function
     * @param {Array} [args=[]] - Arguments to pass to the function
     * @param {number} [delay=0] - Delay in milliseconds before execution (default: 0)
     * @throws {M4LLibError} If the function parameter is not a function or the operation fails
     * 
     * @example
     * // Defer a function call with no delay
     * M4LLib.defer(() => {
     *     post("This runs in a lower priority thread\n");
     * });
     * 
     * // Defer with context and arguments
     * M4LLib.defer(myFunction, this, [arg1, arg2], 100);
     */
    static defer(fn, context = null, args = [], delay = 0) {
        const methodName = 'M4LLib.defer';

        try {
            if (typeof fn !== 'function') {
                throw new M4LLibErrors.M4LLibError(
                    'First argument must be a function',
                    'VALIDATION_ERROR',
                    { received: typeof fn, expected: 'function' },
                    methodName
                );
            }

            // Create a wrapper function that calls the original function
            // Note: Task objects automatically clean themselves up when the function completes
            // Calling freepeer() manually causes "removeproperty called on invalid object" error
            const wrapper = function () {
                try {
                    // Execute the original function
                    fn.apply(context, args);
                } catch (error) {
                    // Handle errors within the deferred function
                    M4LLibErrors.ErrorHandler.handle(error, methodName + '.deferred', false);
                }
                // Task automatically cleans up when function completes - no manual freepeer() needed
            };

            // Create a new Task with the wrapper function and schedule it
            const task = new Task(wrapper, null, []);
            task.schedule(delay);
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
        }
    }

    /**
     * Validates and normalizes a path or ID
     * 
     * @static
     * @param {string|number} pathOrId - The path or ID to validate
     * @returns {string|null} The validated and normalized path or ID, or null if the operation fails
     */
    static conformPathOrId(pathOrId) {
        try {
            const methodName = 'M4LLib.conformPathOrId';

            // Handle null/undefined values explicitly
            if (pathOrId === null || pathOrId === undefined) {
                throw new M4LLibErrors.M4LLibError(
                    'Path or ID parameter cannot be null or undefined',
                    'VALIDATION_ERROR',
                    { received: pathOrId, expected: 'valid path, ID number, or string' },
                    methodName
                );
            }

            if (typeof pathOrId == 'number') {
                return this.prefixId(pathOrId);
            }
            if (typeof pathOrId != 'string') {
                throw new M4LLibErrors.M4LLibError(
                    'Path parameter must be a string',
                    'VALIDATION_ERROR',
                    { received: typeof pathOrId, expected: 'string' },
                    methodName
                );
            }

            // Check if string is actually a numeric ID
            const numericValue = Number(pathOrId);
            if (!isNaN(numericValue) && isFinite(numericValue) && pathOrId.trim() === numericValue.toString()) {
                return this.prefixId(numericValue);
            }

            const firstTerm = pathOrId.split(' ')[0];
            if (firstTerm == 'id') {
                throw new M4LLibErrors.M4LLibError(
                    'Invalid ID format. Use M4LLib.conformId() to convert it to a number.',
                    'VALIDATION_ERROR',
                    { received: pathOrId, expected: 'valid ID' },
                    methodName
                );
            }
            const VALID_FIRST_TERMS = ["control_surfaces", "live_app", "live_set", "this_device"];
            if (!VALID_FIRST_TERMS.includes(firstTerm)) {
                throw new M4LLibErrors.M4LLibError(
                    'Path parameter must be a valid path',
                    'VALIDATION_ERROR',
                    { received: pathOrId, expected: 'valid path' },
                    methodName
                );
            }
            return pathOrId;
        } catch (error) {
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return null;
        }
    }

    /**
     * Iterates over an array of IDs
     * 
     * @static
     * @param {Array} id_array - The array of IDs to iterate over (can be in "id N" format or just numbers)
     * @param {Function} callback - The function to call for each ID
     * 
     * @example
     * M4LLib.iterateIds([id, 1, id, 2, id, 3], (id) => {
     *     post('ID:', id, '\n');
     * });
     */
    static iterateIds(id_array, fn) {
        const response = [];
        if (id_array[0] == 'id') {
            for (let i = 1; i < id_array.length; i += 2) {
                response.push(fn(id_array[i]));
            }
        } else {
            for (let i = 0; i < id_array.length; i++) {
                response.push(fn(id_array[i]));
            }
        }
        return response;
    }

    /**
     * Executes a function with a LiveAPI object and ensures proper cleanup.
     * This implements the RAII pattern for LiveAPI objects and works with any Live object type.
     * 
     * @static
     * @param {string|number} pathOrId - The path or ID to create the LiveAPI object from. Numeric IDs are automatically converted to "id N" format for LiveAPI.
     * @param {Function} operation - The function to execute with the LiveAPI object
     * @param {Object} [context=null] - The context (this) to use when executing the operation
     * @param {Array} [args=[]] - Arguments to pass to the operation function
     * @param {string} [methodName='M4LLib.withLiveAPI'] - The name of the method for error handling
     * @returns {*} The return value of the operation function
     * @throws {M4LLibError} If the operation fails, LiveAPI creation fails, operation parameter is not a function, or the operation fails
     * 
     * @example
     * // Get a track property
     * const trackName = M4LLib.withLiveAPI(trackId, (track) => {
     *     return track.get('name');
     * });
     * 
     * // Set a device parameter
     * M4LLib.withLiveAPI(deviceId, (device) => {
     *     device.set('parameters 0', 0.5);
     * });
     * 
     * // Call a song method
     * M4LLib.withLiveAPI('live_set', (song) => {
     *     song.call('create_scene', -1);
     * });
     * 
     * // Work with application view
     * const viewInfo = M4LLib.withLiveAPI('live_app view', (view) => {
     *     return view.get('focused_view');
     * });
     * 
     * // Works with both numeric IDs and "id N" format
     * const trackName = M4LLib.withLiveAPI(123, (track) => {
     *     return track.get('name');
     * });
     * 
     * // With context and arguments
     * const result = M4LLib.withLiveAPI(trackId, function(track, value) {
     *     track.set('name', this.prefix + value);
     * }, { prefix: 'My_' }, [trackName]);
     */
    static withLiveAPI(pathOrId, operation, context = null, args = [], methodName = 'M4LLib.withLiveAPI') {
        let liveApi = null;
        // Ensure methodName is always a valid string
        if (!methodName || typeof methodName !== 'string') {
            methodName = 'M4LLib.withLiveAPI';
        }

        const originalPathOrId = pathOrId; // Keep original for error reporting

        try {
            pathOrId = this.conformPathOrId(pathOrId);
            if (!pathOrId) {
                throw new M4LLibErrors.M4LLibError(
                    'Path or ID must be a valid path or ID',
                    'VALIDATION_ERROR',
                    { received: originalPathOrId, expected: 'valid path or ID' },
                    methodName
                );
            }
            // Validate inputs
            if (typeof operation !== 'function') {
                throw new M4LLibErrors.M4LLibError(
                    'Operation parameter must be a function',
                    'VALIDATION_ERROR',
                    { received: typeof operation, expected: 'function' },
                    methodName
                );
            }

            // Create the LiveAPI object
            liveApi = new LiveAPI(pathOrId);

            // Execute the operation with the LiveAPI object
            return operation.apply(context, [liveApi, ...args]);

        } catch (error) {
            // If it's already an M4LLibError, rethrow it
            if (error instanceof M4LLibErrors.M4LLibError) {
                throw error;
            }

            // Wrap other errors in M4LLibError
            throw new M4LLibErrors.M4LLibError(
                'LiveAPI operation failed',
                'LIVE_API_ERROR',
                {
                    originalError: error.message,
                    originalPathOrId: originalPathOrId,
                    pathOrId: pathOrId,
                    operation: operation.name || 'anonymous'
                },
                methodName
            );
        } finally {
            // Always clean up the LiveAPI object
            if (liveApi) {
                liveApi.freepeer();
            }
        }
    }
}

// ========================================================================
// OBSERVER PATTERN UTILITIES
// ========================================================================

/**
 * IdObserver - A utility class for monitoring Live objects and managing LiveAPI resources
 * 
 * This class implements the Observer pattern for Live objects, automatically managing
 * LiveAPI lifecycle and providing a clean interface for monitoring changes.
 * 
 * @since 1.0.0
 */
class IdObserver {
    /**
     * Creates a new IdObserver instance
     * 
     * @param {string} path - The Live path to monitor (e.g., 'live_set view detail_clip')
     * @param {Function} callback - The function to call when the observed object changes
     * @param {Object} [context=null] - The context (this) to use when calling the callback
     * @param {Array} [args=[]] - Additional arguments to pass to the callback
     * @throws {M4LLibError} If path is invalid or callback is not a function
     * 
     * @example
     * // Monitor detail clip changes
     * const detailClipObserver = new IdObserver(
     *     'live_set view detail_clip',
     *     (detailClip) => {
     *         post('Detail clip changed:', detailClip.id, '\n');
     *     }
     * );
     * 
     * // Monitor with context and arguments
     * const trackObserver = new IdObserver(
     *     'live_set tracks 0',
     *     function(track, customArg) {
     *         post('Track changed:', track.get('name'), 'Custom arg:', customArg, '\n');
     *     },
     *     this,
     *     ['myCustomValue']
     * );
     */
    constructor(path, callback, context = null, args = []) {
        const methodName = 'IdObserver.constructor';

        try {
            // Validate inputs
            if (typeof path !== 'string') {
                throw new M4LLibErrors.M4LLibError(
                    'Path parameter must be a string',
                    'VALIDATION_ERROR',
                    { received: typeof path, expected: 'string' },
                    methodName
                );
            }

            if (typeof callback !== 'function') {
                throw new M4LLibErrors.M4LLibError(
                    'Callback parameter must be a function',
                    'VALIDATION_ERROR',
                    { received: typeof callback, expected: 'function' },
                    methodName
                );
            }

            this.path = path;
            this.callback = callback;
            this.context = context;
            this.args = args;
            this.isActive = false;

            // Create the LiveAPI observer
            this.object = new LiveAPI(this._createCallbackWrapper(), path);
            this.object.mode = 1;
            this.isActive = true;

        } catch (error) {
            // Clean up if construction fails
            if (this.object) {
                this.object.freepeer();
                this.object = null;
            }

            // Wrap and rethrow the error
            if (error instanceof M4LLibErrors.M4LLibError) {
                throw error;
            }

            throw new M4LLibErrors.M4LLibError(
                'Failed to create IdObserver',
                'OBSERVER_CREATION_ERROR',
                {
                    originalError: error.message,
                    path: path,
                    callback: callback.name || 'anonymous'
                },
                methodName
            );
        }
    }

    /**
     * Creates a wrapper function that calls the user's callback with proper error handling
     * 
     * @private
     * @returns {Function} The wrapped callback function
     */
    _createCallbackWrapper() {
        return () => {
            try {
                if (this.isActive && this.object) {
                    // Call the user's callback with the LiveAPI object and any additional args
                    this.callback.apply(this.context, [this.object, ...this.args]);
                }
            } catch (error) {
                // Log errors but don't crash the observer
                M4LLibErrors.ErrorHandler.handle(error, 'IdObserver.callback', false);
            }
        };
    }

    /**
     * Gets the current ID of the observed object
     * 
     * @returns {number|null} The current ID, or null if the observer is inactive
     * 
     * @example
     * const currentId = detailClipObserver.getId();
     * if (currentId !== 0) {
     *     post('Current detail clip ID:', currentId, '\n');
     * }
     */
    getId() {
        if (!this.isActive || !this.object) {
            return null;
        }
        try {
            return this.object.id;
        } catch (error) {
            // LiveAPI object may become invalid if the underlying Live object is deleted
            // Return null to indicate invalid state
            return null;
        }
    }

    /**
     * Gets the current path of the observed object
     * 
     * @returns {string|null} The current path, or null if the observer is inactive
     * 
     * @example
     * const currentPath = detailClipObserver.getPath();
     * post('Current detail clip path:', currentPath, '\n');
     */
    getPath() {
        if (!this.isActive || !this.object) {
            return null;
        }
        try {
            return this.object.path;
        } catch (error) {
            // LiveAPI object may become invalid if the underlying Live object is deleted
            // Return null to indicate invalid state
            return null;
        }
    }

    /**
     * Checks if the observer is currently active
     * 
     * @returns {boolean} True if the observer is active, false otherwise
     * 
     * @example
     * if (detailClipObserver.isActive()) {
     *     post('Observer is monitoring detail clip changes\n');
     * }
     */
    isActive() {
        return this.isActive;
    }

    /**
     * Temporarily pauses the observer
     * 
     * The observer will stop calling the callback but maintains its LiveAPI connection.
     * Use resume() to reactivate it.
     * 
     * @example
     * detailClipObserver.pause();
     * // ... do some work that shouldn't trigger callbacks ...
     * detailClipObserver.resume();
     */
    pause() {
        this.isActive = false;
        this.object.mode = 0;
    }

    /**
     * Resumes a paused observer
     * 
     * The observer will resume calling the callback when the observed object changes.
     * 
     * @example
     * detailClipObserver.resume();
     */
    resume() {
        this.isActive = true;
        this.object.mode = 1;
    }

    /**
     * Destroys the observer and cleans up resources
     * 
     * This method should be called when the observer is no longer needed to prevent
     * memory leaks and ensure proper cleanup of LiveAPI resources.
     * 
     * @example
     * // Clean up when done
     * detailClipObserver.destroy();
     */
    destroy() {
        if (this.object) {
            this.object.freepeer();
            this.object = null;
        }
        this.isActive = false;
        this.callback = null;
        this.context = null;
        this.args = [];
    }
}

// Export using the Max for Live require system
// This follows the pattern documented in the Max JavaScript User Guide
exports.M4LLib = M4LLib;
exports.IdObserver = IdObserver;
