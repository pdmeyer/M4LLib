/**
 * M4LLib - A utility library for Max for Live (M4L) operations
 * 
 * This class provides static methods for interacting with Ableton Live's API,
 * managing MIDI clips, tracks, and clip slots. It handles common operations
 * like creating MIDI clips, adding notes, and managing track resources.
 * 
 * @class M4LLib
 * @since 1.0.0
 */

// Include error handling system
// Note: In Max for Live, you'll need to include m4l-errors.js before this file
// or copy the error classes directly into this file

"use strict";

class M4LLib {
    /**
     * Creates a new PDMM4L instance
     * 
     * @constructor
     */
    constructor() {}

    /**
     * Gets the ID of the current device
     * 
     * @static
     * @returns {number} The device ID
     */
    static getThisDeviceId() {
        const id = this.getIdFromPath('this_device');
        return id;
    }

    /**
     * Gets the track ID of the current device's track
     * 
     * @static
     * @returns {number} The track ID
     * @throws {Error} If unable to access the current device or track
     * 
     * @example
     * const trackId = PDMM4L.getThisTrackId();
     * // Returns: "id 123"
     */
    static getThisTrackId() {
        const lapi = new LiveAPI('live_setthis_device');
        const track_path = td.get('path').split(' ').slice(0, 3);
        lapi.freepeer();
        lapi = new LiveAPI(track_path);
        const track_id = lapi.id;
        lapi.freepeer();
        return track_id;
    }

    /**
     * Dumps notes to the next empty clip slot for a specified track
     * 
     * @static
     * @param {string|number} trackId - The track ID to create the clip in
     * @param {Object} notes - Object containing notes data with 'notes' key
     * @param {Array} notes.notes - Array of note objects to add to the clip
     * @param {string} [clip_name=""] - Optional name for the new clip
     * @returns {boolean} True if the notes were dumped to the clip, false otherwise
     * @throws {Error} If track cannot have MIDI clips or if notes format is invalid
     *
     * 
     * @example
     * const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
     * const clipId = PDMM4L.dumpNoteToNextEmptyClipForTrack(trackId, notes, "My Clip");
     */
    static dumpNoteToNextEmptyClipForTrack(trackId, notes, clip_name = "") {
        if(!this.validateId(trackId)) {
            error("PDM.M4L.Lib.dumpNoteToNextEmptyClipForTrack: trackId is expected to be a number. Use M4LLib.conformid() to convert a string or array to a number.");
            return false;
        }
        const nextEmptyClipSlotId = this.getNextEmptyClipSlotIdForTrack(trackId);
        const clip = this.createNewEmptyMidiClip(notes.length, nextEmptyClipSlotId);
        this.addNotesToClip(clip, notes);

        return true;
    }

    /**
     * Adds notes to an existing MIDI clip
     * 
     * @static
     * @param {Object} clip - The LiveAPI clip object to add notes to
     * @param {Object} notes - Object containing notes data
     * @param {Array} notes.notes - Array of note objects to add
     * @returns {boolean} True if the notes were added to the clip, false otherwise
     * @throws {MidiOperationError} If notes object format is invalid
     * @throws {LiveApiError} If Live API operation fails
     * 
     * @example
     * const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
     * M4LLib.addNotesToClip(clip, notes);
     */
    static addNotesToClip(clip, notes) {
        const methodName = 'M4LLib.addNotesToClip';
        
        try {
            // Validate inputs
            if (!clip || typeof clip !== 'object') {
                throw new M4LLibErrors.ValidationError(
                    'Clip parameter must be a valid LiveAPI object',
                    { received: typeof clip, expected: 'object' },
                    methodName
                );
            }
            
            if (!notes || typeof notes !== 'object') {
                throw new M4LLibErrors.ValidationError(
                    'Notes parameter must be an object',
                    { received: typeof notes, expected: 'object' },
                    methodName
                );
            }
            
            const keys = Object.keys(notes);
            if (keys.length !== 1 || keys[0] !== 'notes') {
                throw new M4LLibErrors.ValidationError(
                    'Notes object must have exactly one key named "notes"',
                    { received: keys, expected: ['notes'] },
                    methodName
                );
            }
            
            if (!Array.isArray(notes.notes)) {
                throw new M4LLibErrors.ValidationError(
                    'Notes.notes must be an array',
                    { received: typeof notes.notes, expected: 'array' },
                    methodName
                );
            }
            
            // Validate note structure
            if (notes.notes.length > 0) {
                const firstNote = notes.notes[0];
                const requiredFields = ['pitch', 'start_time', 'duration', 'velocity'];
                const missingFields = requiredFields.filter(field => !(field in firstNote));
                
                if (missingFields.length > 0) {
                    throw new M4LLibErrors.ValidationError(
                        'Note objects must contain required fields: pitch, start_time, duration, velocity',
                        { missingFields, example: { pitch: 60, start_time: 0, duration: 1, velocity: 100 } },
                        methodName
                    );
                }
            }
            
            // Create and populate the Dict object
            const notesDict = new Dict();
            try {
                notesDict.parse(JSON.stringify({notes: notes}));
                
                // Add notes to the clip
                clip.call('add_new_notes', notesDict);
                
                return true;
            } catch (liveApiError) {
                throw new M4LLibErrors.LiveApiError(
                    'Failed to add notes to clip via Live API',
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
            }
            
        } catch (error) {
            // Handle the error consistently
            M4LLibErrors.ErrorHandler.handle(error, methodName, false);
            return false;
        }
    }

    /**
     * Creates a new empty MIDI clip in a specified clip slot
     * 
     * @static
     * @param {number} length - The length of the clip in beats
     * @param {string|number} clipSlotId - The clip slot ID to create the clip in
     * @returns {number|null} The ID of the created clip, or null if creation fails
     * @throws {Error} If unable to get track path from clip slot path
     * 
     * @example
     * const clipId = PDMM4L.createNewEmptyMidiClip(4, clipSlotId);
     * // Creates a 4-beat MIDI clip
     */
    static createNewEmptyMidiClip(length, clipSlotId) {
        const clipSlot = new LiveAPI(clipSlotId);
        const trackPath = this.getTrackPathFromPath(clipSlot.path);
        if(trackPath == null) {
            error("PDM.M4L.Lib.createNewEmptyMidiClip: failed to get track path from path: " + clipSlot.path + "\n");
            return null;
        }
        clipSlot.call('create_clip', length);
        const clip = new LiveAPI(clipSlot.get('clip'));
        clipSlot.freepeer();
        const id = clip.id;
        clip.freepeer();
        return id;
    };

    /**
     * Extracts the track path from a full path string
     * 
     * @static
     * @param {string} path - The full path string (e.g., "live_set tracks 0 clip_slots 0")
     * @returns {string|null} The track path (e.g., "live_set tracks 0"), or null if invalid
     * @throws {Error} If path is not a string or doesn't contain expected structure
     * 
     * @example
     * const trackPath = PDMM4L.getTrackPathFromPath("live_set tracks 0 clip_slots 0");
     * // Returns: "live_set tracks 0"
     */
    static getTrackPathFromPath(path) {
        if(typeof path != 'string') {
            error("PDM.M4L.Lib.getTrackPathFromPath: path is expected to be a string");
            return null;
        }
        const pathParts = path.split(' ');
        if(pathParts[1] !== 'tracks') {
            error("PDM.M4L.Lib.getTrackPathFromPath: invalid path. Expected the item at position 2 to be 'tracks', but got '" + pathParts[1] + "\n");
            return null;
        }
        const trackPathParts = pathParts.slice(0, 3);
        return trackPathParts.join(' ');
    }

    /**
     * Creates a new empty clip slot for a specified track
     * 
     * @static
     * @param {string|number} trackId - The track ID to create the clip slot in
     * @returns {string|null} The ID of the created clip slot, or null if creation fails
     * @throws {Error} If track cannot have MIDI clips
     * 
     * @example
     * const clipSlotId = PDMM4L.createNewEmptyClipSlotForTrack(trackId);
     */
    static createNewEmptyClipSlotForTrack(trackId) {
        if(!this.validateId(trackId)) {
            error("PDM.M4L.Lib.createNewEmptyClipSlotForTrack: trackId is expected to be a number. Use M4LLib.conformid() to convert a string or array to a number.");
            return null;
        }
        const track = new LiveAPI(trackId);
        const hasMidiInput = track.get('has_midi_input');
        if(!hasMidiInput) {
            error("PDM.M4L.Lib.getNextEmptyClipSlotForTrack: track cannot have MIDI clips.");
            track.freepeer();
            return null;
        }
        track.freepeer();

        let liveset = new LiveAPI('live_set');
        liveset.call('create_scene', -1);
        const newSceneIndex = liveset.get('scenes').length / 2 - 1;
        liveset.freepeer();

        const emptyClipSlotPath = 'live_set tracks ' + trackId + ' clip_slots ' + newSceneIndex;
        const emptyClipSlot = new LiveAPI(emptyClipSlotPath);
        const id = emptyClipSlot.id;
        emptyClipSlot.freepeer();
        return id;

    }

    /**
     * Finds the next empty clip slot for a specified track
     * 
     * @static
     * @param {string|number} trackId - The track ID to search for empty clip slots
     * @param {number} [start_index=0] - The starting index to search from
     * @returns {number|null} The ID of the next empty clip slot, or null if none found
     * @throws {Error} If track cannot have MIDI clips
     * 
     * @example
     * const emptySlotId = PDMM4L.getNextEmptyClipSlotIdForTrack(trackId, 2);
     * // Starts searching from index 2
     */
    static getNextEmptyClipSlotIdForTrack(trackId, start_index = 0) {
        if(!this.validateId(trackId)) {
            error("PDM.M4L.Lib.getNextEmptyClipSlotForTrack: trackId is expected to be a number. Use M4LLib.conformid() to convert a string or array to a number.");
            return null;
        }
        const track = new LiveAPI(trackId);
        const hasMidiInput = track.get('has_midi_input');
        if(!hasMidiInput) {
            error("PDM.M4L.Lib.getNextEmptyClipSlotForTrack: track cannot have MIDI clips.");
            track.freepeer();
            return null;
        }
        
        let emptyClipSlot = null;
        const clipSlots = track.get('clip_slots');
        track.freepeer();
        for (let i = start_index * 2 + 1; i < clipSlots.length; i+=2) {
            const id = this.prefixId(clipSlots[i]);
            const clipSlot = new LiveAPI(id);
            if (clipSlot.get('has_clip') == 0) {
                emptyClipSlot = clipSlot;
                break;
            }
            clipSlot.freepeer();    
        }
        return emptyClipSlot.id;
    };

    /**
     * Navigates to the device view
     * 
     * @static
     * @returns {boolean} True if the navigation was successful, false otherwise
     */
    static navigateToDevice(deviceId) {
        if(!this.validateId(deviceId)) {
            error("PDM.M4L.Lib.navigateToDevice: deviceId is expected to be a number. Use M4LLib.conformid() to convert a string or array to a number.");
            return false;
        }
        const view = new LiveAPI('live_app view');
        view.call('focus_view', 'Detail/DeviceChain');

        const setView = new LiveAPI('live_set view');
        setView.call('select_device', 'id', deviceId);

        // Clean up
        view.freepeer();
        setView.freepeer();
        return true;
    }

    /**
     * Parses and normalizes various ID formats to a consistent format
     * 
     * @static
     * @param {string|number|Array} id - The ID to parse (can be string, number, or array)
     * @returns {number} The numeric ID
     * 
     * @example
     * PDMM4L.conformid("id 123");     // Returns: "id 123"
     * PDMM4L.conformid(123);          // Returns: "id 123"
     * PDMM4L.conformid(["id", 123]);  // Returns: "id 123"
     * PDMM4L.conformid([123]);        // Returns: "id 123"
     */
    static conformId(id) {
        let numericId = null;
        if(typeof id == 'string') {
            if(id.startsWith('id ')) numericId = id.slice(3);
            else numericId = Number(id);
        } else if(typeof id == 'number') {
            numericId = id;
        } else if (Array.isArray(id)) {
            if(id[0] == 'id') numericId = id[1];
            else numericId = id[0];
        }
        return numericId;
    }

    /**
     * Validates that an ID is a number
     * 
     * @static
     * @param {string|number|Array} id - The ID to validate
     * @returns {boolean} True if the ID is a number, false otherwise
     */
    static validateId(id) {
        return typeof id == 'number';
    }

    /**
     * Adds the "id " prefix to a numeric ID
     * 
     * @static
     * @param {number} numericId - The numeric ID to prefix
     * @returns {string} The ID with "id " prefix
     * 
     * @example
     * PDMM4L.prefixId(123); // Returns: "id 123"
     */
    static prefixId(numericId) {
        return "id " + numericId;
    }

    /**
     * Gets the ID from a path
     * 
     * @static
     * @param {string} path - The path to get the ID from
     * @returns {string} The ID
     */
    static getIdFromPath(path) {
        if(typeof path != 'string') {
            error("PDM.M4L.Lib.getIdFromPath: path is expected to be a string");
            return null;
        }
        const object = new LiveAPI(path);
        const id = object.id;
        object.freepeer();
        return id;
    }

    static getIdFromObject(object) {
        const id = object.id;
        return id;
    }

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
        if (typeof fn !== 'function') {
            error("M4LLib.defer: First argument must be a function");
            return;
        }

        // Create a wrapper function that calls the original function and then cleans up
        const wrapper = function() {
            try {
                // Execute the original function
                fn.apply(context, args);
            } finally {
                // Always clean up the task
                arguments.callee.task.freepeer();
            }
        };

        // Create a new Task with the wrapper function and schedule it
        const task = new Task(wrapper, null, []);
        task.schedule(delay);
    }
}

exports = M4LLib;
