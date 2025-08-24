/**
 * Example demonstrating the new M4LLib.withLiveAPI method
 * This shows how to use the RAII pattern for LiveAPI objects
 */

const M4LLib = require('../lib/pdm.m4l.lib.js').M4LLib;

// Example 1: Getting a track property
function getTrackName(trackId) {
    return M4LLib.withLiveAPI(trackId, (track) => {
        return track.get('name');
    });
}

// Example 2: Setting a device parameter
function setDeviceParameter(deviceId, parameterIndex, value) {
    M4LLib.withLiveAPI(deviceId, (device) => {
        device.set('parameters ' + parameterIndex, value);
    });
}

// Example 3: Calling a song method
function createNewScene() {
    M4LLib.withLiveAPI('live_set', (song) => {
        song.call('create_scene', -1);
    });
}

// Example 4: Getting multiple properties from a track
function getTrackInfo(trackId) {
    return M4LLib.withLiveAPI(trackId, (track) => {
        return {
            name: track.get('name'),
            hasMidiInput: track.get('has_midi_input'),
            color: track.get('color')
        };
    });
}

// Example 5: With context and arguments
function setTrackNameWithContext(trackId, trackName) {
    M4LLib.withLiveAPI(trackId, function(track, name) {
        track.set('name', this.prefix + name);
    }, { prefix: 'My_' }, [trackName]);
}

// Example 6: Error handling (the method handles cleanup automatically)
function safeGetProperty(objectId, propertyName) {
    try {
        return M4LLib.withLiveAPI(objectId, (obj) => {
            return obj.get(propertyName);
        });
    } catch (error) {
        post('Error getting property:', error.message, '\n');
        return null;
    }
}

// Example 7: Working with application view
function getApplicationViewInfo() {
    return M4LLib.withLiveAPI('live_app view', (view) => {
        return {
            focusedView: view.get('focused_view'),
            mainView: view.get('main_view')
        };
    });
}

// Example 8: Working with song view
function getSongViewInfo() {
    return M4LLib.withLiveAPI('live_set view', (view) => {
        return {
            selectedTrack: view.get('selected_track'),
            selectedScene: view.get('selected_scene'),
            detailView: view.get('detail_clip')
        };
    });
}

// Example 9: Complex operation with multiple LiveAPI calls
function getClipSlotInfo(clipSlotId) {
    // This would normally require multiple LiveAPI objects and careful cleanup
    // But with withLiveAPI, each call is automatically cleaned up
    const clipSlot = M4LLib.withLiveAPI(clipSlotId, (slot) => {
        return {
            hasClip: slot.get('has_clip'),
            clipId: slot.get('has_clip') ? slot.get('clip') : null
        };
    });
    
    if (clipSlot.hasClip && clipSlot.clipId) {
        const clipInfo = M4LLib.withLiveAPI(clipSlot.clipId, (clip) => {
            return {
                name: clip.get('name'),
                length: clip.get('length'),
                startTime: clip.get('start_time')
            };
        });
        return { ...clipSlot, clipInfo };
    }
    
    return clipSlot;
}

// Example 10: Working with devices
function getDeviceInfo(deviceId) {
    return M4LLib.withLiveAPI(deviceId, (device) => {
        return {
            name: device.get('name'),
            type: device.get('type'),
            class_name: device.get('class_name'),
            parameters: device.get('parameters')
        };
    });
}

// Example 11: Before and after comparison
function oldWayGetTrackName(trackId) {
    let track = null;
    try {
        track = new LiveAPI(trackId);
        const name = track.get('name');
        return name;
    } catch (error) {
        post('Error:', error.message, '\n');
        return null;
    } finally {
        if (track) track.freepeer();
    }
}

function newWayGetTrackName(trackId) {
    return M4LLib.withLiveAPI(trackId, (track) => {
        return track.get('name');
    });
}

// Export examples for testing
exports.getTrackName = getTrackName;
exports.setDeviceParameter = setDeviceParameter;
exports.createNewScene = createNewScene;
exports.getTrackInfo = getTrackInfo;
exports.setTrackNameWithContext = setTrackNameWithContext;
exports.safeGetProperty = safeGetProperty;
exports.getApplicationViewInfo = getApplicationViewInfo;
exports.getSongViewInfo = getSongViewInfo;
exports.getClipSlotInfo = getClipSlotInfo;
exports.getDeviceInfo = getDeviceInfo;
exports.oldWayGetTrackName = oldWayGetTrackName;
exports.newWayGetTrackName = newWayGetTrackName;
