## Classes

<dl>
<dt><a href="#M4LLib">M4LLib</a> ℗</dt>
<dd></dd>
<dt><a href="#IdObserver">IdObserver</a></dt>
<dd><p>IdObserver - A utility class for monitoring Live objects and managing LiveAPI resources</p>
<p>This class implements the Observer pattern for Live objects, automatically managing
LiveAPI lifecycle and providing a clean interface for monitoring changes.</p>
</dd>
</dl>

<a name="M4LLib"></a>

## M4LLib ℗
**Kind**: global class  
**Access**: private  

* [M4LLib](#M4LLib) ℗
            * [.conformId(id)](#M4LLib.conformId) ⇒ <code>number</code>
    * [.iterateIds(id_array, callback)](#M4LLib.iterateIds) ⇒ <code>Array</code>
    * [.withLiveAPI(pathOrId, operation, [context], [args], [methodName])](#M4LLib.withLiveAPI) ⇒ <code>\*</code>
    * [.defer(fn, [context], [args], [delay])](#M4LLib.defer)
    * [.conformPathOrId(pathOrId)](#M4LLib.conformPathOrId) ⇒ <code>string</code> \| <code>null</code>
    * [.getItemIndexFromPath(path, itemType)](#M4LLib.getItemIndexFromPath) ⇒ <code>string</code>
    * [.prefixId(numericId)](#M4LLib.prefixId) ⇒ <code>string</code>
    * [.validateId(id, methodName)](#M4LLib.validateId)
    * [.getObjectProperty(object, property)](#M4LLib.getObjectProperty) ⇒ <code>\*</code>
    * [.getObjectInfo(id)](#M4LLib.getObjectInfo) ⇒ <code>Object</code>
    * [.getChildren(id, childClass)](#M4LLib.getChildren) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
    * [.getPropertiesForChildren(id, childClass, [childProperties])](#M4LLib.getPropertiesForChildren) ⇒ <code>Object</code> \| <code>null</code>
    * [.getPropertiesForObjects(idArray, [properties])](#M4LLib.getPropertiesForObjects) ⇒ <code>Object</code> \| <code>null</code>
    * [.getThisDeviceId()](#M4LLib.getThisDeviceId) ⇒ <code>number</code> \| <code>null</code>
    * [.getThisTrackId()](#M4LLib.getThisTrackId) ⇒ <code>number</code> \| <code>null</code>
    * [.navigateToDevice()](#M4LLib.navigateToDevice) ⇒ <code>boolean</code>
    * [.getDeviceParameterNames(deviceId)](#M4LLib.getDeviceParameterNames) ⇒ <code>Object</code> \| <code>null</code>
    * [.getDeviceParameters(deviceId)](#M4LLib.getDeviceParameters) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
    * [.getDeviceParameterInfo(deviceId, [properties])](#M4LLib.getDeviceParameterInfo) ⇒ <code>Object</code> \| <code>null</code>
    * [.getPropertiesForChildren(id, childClass, [childProperties])](#M4LLib.getPropertiesForChildren) ⇒ <code>Object</code> \| <code>null</code>
    * [.getChildren(id, childClass)](#M4LLib.getChildren) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
    * [.getPropertiesForObjects(idArray, [properties])](#M4LLib.getPropertiesForObjects) ⇒ <code>Object</code> \| <code>null</code>
    * [.getObjectProperty(object, property)](#M4LLib.getObjectProperty) ⇒ <code>\*</code>
    * [.getObjectInfo(id)](#M4LLib.getObjectInfo) ⇒ <code>Object</code>
    * [.dumpNotesToNextEmptyClipForTrack(trackId, notes)](#M4LLib.dumpNotesToNextEmptyClipForTrack) ⇒ <code>number</code> \| <code>null</code>
    * [.calculateClipLengthFromNotes(notes)](#M4LLib.calculateClipLengthFromNotes) ⇒ <code>number</code>
    * [.addNotesToClip(clipId, notes)](#M4LLib.addNotesToClip) ⇒ <code>boolean</code>
    * [.createNewEmptyMidiClip(length, clipSlotId)](#M4LLib.createNewEmptyMidiClip) ⇒ <code>number</code> \| <code>null</code>
    * [.createNewEmptyClipSlotForTrack(trackId)](#M4LLib.createNewEmptyClipSlotForTrack) ⇒ <code>number</code> \| <code>null</code>
    * [.getNextEmptyClipSlotIdForTrack(trackId, [start_index])](#M4LLib.getNextEmptyClipSlotIdForTrack) ⇒ <code>number</code> \| <code>null</code>
    * [.createNewSceneAtBottom()](#M4LLib.createNewSceneAtBottom) ⇒ <code>number</code> \| <code>null</code>
    * [.getTrackPathFromPath(path)](#M4LLib.getTrackPathFromPath) ⇒ <code>string</code> \| <code>null</code>
    * [.getIdFromPath(path)](#M4LLib.getIdFromPath) ⇒ <code>number</code> \| <code>null</code>
    * [.getPathFromId(id)](#M4LLib.getPathFromId) ⇒ <code>string</code> \| <code>null</code>
    * [.getIdFromObject(object)](#M4LLib.getIdFromObject) ⇒ <code>number</code>
    * [.conformIdArray(id_array)](#M4LLib.conformIdArray) ⇒ <code>Array.&lt;number&gt;</code>

### M4LLib.conformId(id) ⇒ <code>number</code>
Parses and normalizes various ID formats to a consistent format

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> - The numeric ID  
**Throws**:

- <code>M4LLibError</code> If the id parameter is invalid, cannot be parsed, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> \| <code>Array</code> | The ID to parse (can be string, number, or array) |

**Example**  
```javascript
M4LLib.conformId("id 123");     // Returns: 123
M4LLib.conformId(123);          // Returns: 123
M4LLib.conformId(["id", 123]);  // Returns: 123
M4LLib.conformId([123]);        // Returns: 123
```
<a name="M4LLib.iterateIds"></a>

### M4LLib.iterateIds(id_array, callback) ⇒ <code>Array</code>
Iterates over an array of IDs

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array</code> - An array containing the results of calling the callback function for each ID  

| Param | Type | Description |
| --- | --- | --- |
| id_array | <code>Array</code> | The array of IDs to iterate over (can be in "id N" format or just numbers) |
| callback | <code>function</code> | The function to call for each ID |

**Example**  
```javascript
M4LLib.iterateIds([id, 1, id, 2, id, 3], (id) => {
    post('ID:', id, '\n');
});
```
<a name="M4LLib.withLiveAPI"></a>

### M4LLib.withLiveAPI(pathOrId, operation, [context], [args], [methodName]) ⇒ <code>\*</code>
Executes a function with a LiveAPI object and ensures proper cleanup.
This implements the RAII pattern for LiveAPI objects and works with any Live object type.

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>\*</code> - The return value of the operation function  
**Throws**:

- <code>M4LLibError</code> If the operation fails, LiveAPI creation fails, operation parameter is not a function, or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pathOrId | <code>string</code> \| <code>number</code> |  | The path or ID to create the LiveAPI object from. Numeric IDs are automatically converted to "id N" format for LiveAPI. |
| operation | <code>function</code> |  | The function to execute with the LiveAPI object |
| [context] | <code>Object</code> | <code></code> | The context (this) to use when executing the operation |
| [args] | <code>Array</code> | <code>[]</code> | Arguments to pass to the operation function |
| [methodName] | <code>string</code> | <code>&quot;&#x27;M4LLib.withLiveAPI&#x27;&quot;</code> | The name of the method for error handling |

**Example**  
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

// Work with application view
const viewInfo = M4LLib.withLiveAPI('live_app view', (view) => {
    return view.get('focused_view');
});

// Works with both numeric IDs and "id N" format
const trackName = M4LLib.withLiveAPI(123, (track) => {
    return track.get('name');
});

// With context and arguments
const result = M4LLib.withLiveAPI(trackId, function(track, value) {
    track.set('name', this.prefix + value);
}, { prefix: 'My_' }, [trackName]);
```
<a name="M4LLib.defer"></a>

### M4LLib.defer(fn, [context], [args], [delay])
Schedules a function to be executed with a delay using Max's Task system.
This is useful for avoiding Ableton Live's restrictions on triggering certain operations
in response to notifications.

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Throws**:

- <code>M4LLibError</code> If the function parameter is not a function or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to execute |
| [context] | <code>Object</code> | <code></code> | The context (this) to use when executing the function |
| [args] | <code>Array</code> | <code>[]</code> | Arguments to pass to the function |
| [delay] | <code>number</code> | <code>0</code> | Delay in milliseconds before execution (default: 0) |

**Example**  
```javascript
// Defer a function call with no delay
M4LLib.defer(() => {
    post("This runs in a lower priority thread\n");
});

// Defer with context and arguments
M4LLib.defer(myFunction, this, [arg1, arg2], 100);
```
<a name="M4LLib.conformPathOrId"></a>

### M4LLib.conformPathOrId(pathOrId) ⇒ <code>string</code> \| <code>null</code>
Validates and normalizes a path or ID

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> \| <code>null</code> - The validated and normalized path or ID, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| pathOrId | <code>string</code> \| <code>number</code> | The path or ID to validate |

<a name="M4LLib.getItemIndexFromPath"></a>

### M4LLib.getItemIndexFromPath(path, itemType) ⇒ <code>string</code>
Gets the index of an item from a path

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> - The index of the item as a string  
**Throws**:

- <code>M4LLibError</code> If the item type is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to get the item index from |
| itemType | <code>string</code> | The type of item to get the index of |

**Example**  
```javascript
const itemIndex = M4LLib.getItemIndexFromPath("live_set tracks 0", "tracks");
// Returns: "0"
```
<a name="M4LLib.prefixId"></a>

### M4LLib.prefixId(numericId) ⇒ <code>string</code>
Adds the "id " prefix to a numeric ID

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> - The ID with "id " prefix  
**Throws**:

- <code>M4LLibError</code> If the numericId parameter is not a number or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| numericId | <code>number</code> | The numeric ID to prefix |

**Example**  
```javascript
M4LLib.prefixId(123); // Returns: "id 123"
```
<a name="M4LLib.validateId"></a>

### M4LLib.validateId(id, methodName)
Validates that an ID is a number

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Throws**:

- <code>M4LLibError</code> If the id parameter is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> \| <code>Array</code> | The ID to validate |
| methodName | <code>string</code> | The name of the calling method for error context |

<a name="M4LLib.getObjectProperty"></a>

### M4LLib.getObjectProperty(object, property) ⇒ <code>\*</code>
Gets a property value from a LiveAPI object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>\*</code> - The property value, or null if the property is not accessible  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The LiveAPI object to get the property from |
| property | <code>string</code> | The name of the property to get |

<a name="M4LLib.getObjectInfo"></a>

### M4LLib.getObjectInfo(id) ⇒ <code>Object</code>
Gets detailed information about a Live object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> - An object containing the parsed info string with properties and their types  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the object to get information for |

<a name="M4LLib.getChildren"></a>

### M4LLib.getChildren(id, childClass) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
Gets the children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array.&lt;number&gt;</code> \| <code>null</code> - An array of child IDs, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the parent object to get children from |
| childClass | <code>string</code> | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |

<a name="M4LLib.getPropertiesForChildren"></a>

### M4LLib.getPropertiesForChildren(id, childClass, [childProperties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for all children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are child IDs and values are objects containing the requested properties, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If the parent ID is invalid, child class is not valid for the parent, or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> \| <code>number</code> |  | The ID of the parent object to get children from |
| childClass | <code>string</code> |  | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |
| [childProperties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve for each child. If null, uses all valid properties |

**Example**  
```javascript
// Get all parameter properties for a device
const deviceParams = M4LLib.getPropertiesForChildren(deviceId, 'parameters');
// Returns: { "id 1": { name: "Volume", value: 0.5 }, "id 2": { name: "Pan", value: 0 } }
```
**Example**  
```javascript
// Get specific properties for track children
const trackInfo = M4LLib.getPropertiesForChildren(liveSetId, 'tracks', ['name', 'color']);
// Returns: { "id 1": { name: "Audio Track", color: 0 }, "id 2": { name: "MIDI Track", color: 1 } }
```
<a name="M4LLib.getPropertiesForObjects"></a>

### M4LLib.getPropertiesForObjects(idArray, [properties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for an array of object IDs

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are object IDs and values are objects containing the requested properties, or null if the operation fails  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| idArray | <code>Array.&lt;number&gt;</code> |  | Array of object IDs to get properties for |
| [properties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve. If null, uses all valid properties |

<a name="M4LLib.getThisDeviceId"></a>

### M4LLib.getThisDeviceId() ⇒ <code>number</code> \| <code>null</code>
Gets the ID of the current device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The device ID, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If the operation fails

<a name="M4LLib.getThisTrackId"></a>

### M4LLib.getThisTrackId() ⇒ <code>number</code> \| <code>null</code>
Gets the track ID of the current device's track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The track ID, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If unable to access the current device or track or if the operation fails

**Example**  
```javascript
const trackId = M4LLib.getThisTrackId();
// Returns: "id 123"
```
<a name="M4LLib.navigateToDevice"></a>

### M4LLib.navigateToDevice() ⇒ <code>boolean</code>
Navigates to the device view

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>boolean</code> - True if the navigation was successful, false otherwise  
**Throws**:

- <code>M4LLibError</code> If device ID is invalid, navigation fails, or the operation fails

<a name="M4LLib.getDeviceParameterNames"></a>

### M4LLib.getDeviceParameterNames(deviceId) ⇒ <code>Object</code> \| <code>null</code>
Gets the names of the parameters for a device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are parameter IDs and values are objects containing {name: string, id: number}, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> \| <code>number</code> | The ID of the device to get the parameters for |

<a name="M4LLib.getDeviceParameters"></a>

### M4LLib.getDeviceParameters(deviceId) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
Gets the parameter IDs for a device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array.&lt;number&gt;</code> \| <code>null</code> - An array of parameter IDs, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> \| <code>number</code> | The ID of the device to get the parameters for |

<a name="M4LLib.getDeviceParameterInfo"></a>

### M4LLib.getDeviceParameterInfo(deviceId, [properties]) ⇒ <code>Object</code> \| <code>null</code>
Gets parameter information for a device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are parameter IDs and values are objects containing the requested properties, or null if the operation fails  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| deviceId | <code>string</code> \| <code>number</code> |  | The ID of the device to get the parameters for |
| [properties] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Array of property names to retrieve for each parameter |

<a name="M4LLib.getPropertiesForChildren"></a>

### M4LLib.getPropertiesForChildren(id, childClass, [childProperties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for all children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are child IDs and values are objects containing the requested properties, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If the parent ID is invalid, child class is not valid for the parent, or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> \| <code>number</code> |  | The ID of the parent object to get children from |
| childClass | <code>string</code> |  | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |
| [childProperties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve for each child. If null, uses all valid properties |

**Example**  
```javascript
// Get all parameter properties for a device
const deviceParams = M4LLib.getPropertiesForChildren(deviceId, 'parameters');
// Returns: { "id 1": { name: "Volume", value: 0.5 }, "id 2": { name: "Pan", value: 0 } }
```
**Example**  
```javascript
// Get specific properties for track children
const trackInfo = M4LLib.getPropertiesForChildren(liveSetId, 'tracks', ['name', 'color']);
// Returns: { "id 1": { name: "Audio Track", color: 0 }, "id 2": { name: "MIDI Track", color: 1 } }
```
<a name="M4LLib.getChildren"></a>

### M4LLib.getChildren(id, childClass) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
Gets the children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array.&lt;number&gt;</code> \| <code>null</code> - An array of child IDs, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the parent object to get children from |
| childClass | <code>string</code> | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |

<a name="M4LLib.getPropertiesForObjects"></a>

### M4LLib.getPropertiesForObjects(idArray, [properties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for an array of object IDs

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are object IDs and values are objects containing the requested properties, or null if the operation fails  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| idArray | <code>Array.&lt;number&gt;</code> |  | Array of object IDs to get properties for |
| [properties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve. If null, uses all valid properties |

<a name="M4LLib.getObjectProperty"></a>

### M4LLib.getObjectProperty(object, property) ⇒ <code>\*</code>
Gets a property value from a LiveAPI object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>\*</code> - The property value, or null if the property is not accessible  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The LiveAPI object to get the property from |
| property | <code>string</code> | The name of the property to get |

<a name="M4LLib.getObjectInfo"></a>

### M4LLib.getObjectInfo(id) ⇒ <code>Object</code>
Gets detailed information about a Live object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> - An object containing the parsed info string with properties and their types  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the object to get information for |

<a name="M4LLib.dumpNotesToNextEmptyClipForTrack"></a>

### M4LLib.dumpNotesToNextEmptyClipForTrack(trackId, notes) ⇒ <code>number</code> \| <code>null</code>
Dumps notes to the next empty clip slot for a specified track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the created clip, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If track cannot have MIDI clips, notes format is invalid, any operation fails, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| trackId | <code>string</code> \| <code>number</code> | The track ID to create the clip in |
| notes | <code>Object</code> | Object containing notes data with 'notes' key |
| notes.notes | <code>Array</code> | Array of note objects to add to the clip |

**Example**  
```javascript
const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
const clipId = M4LLib.dumpNotesToNextEmptyClipForTrack(trackId, notes);
```
<a name="M4LLib.calculateClipLengthFromNotes"></a>

### M4LLib.calculateClipLengthFromNotes(notes) ⇒ <code>number</code>
Calculates the minimal clip length to contain all notes, min 1 beat.

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> - The minimal clip length  
**Throws**:

- <code>M4LLibError</code> If the notes parameter is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array</code> | Array of note objects |

<a name="M4LLib.addNotesToClip"></a>

### M4LLib.addNotesToClip(clipId, notes) ⇒ <code>boolean</code>
Adds notes to an existing MIDI clip

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>boolean</code> - True if the notes were added to the clip, false otherwise  
**Throws**:

- <code>M4LLibError</code> If notes object format is invalid, clip ID is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| clipId | <code>string</code> \| <code>number</code> | The ID of the clip to add notes to |
| notes | <code>Object</code> | Object containing notes data |
| notes.notes | <code>Array</code> | Array of note objects to add |

**Example**  
```javascript
const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
M4LLib.addNotesToClip(clipId, notes);
```
<a name="M4LLib.createNewEmptyMidiClip"></a>

### M4LLib.createNewEmptyMidiClip(length, clipSlotId) ⇒ <code>number</code> \| <code>null</code>
Creates a new empty MIDI clip in a specified clip slot

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the created clip, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If unable to get track path from clip slot path, clip creation fails, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | The length of the clip in beats |
| clipSlotId | <code>string</code> \| <code>number</code> | The clip slot ID to create the clip in |

**Example**  
```javascript
const clipId = M4LLib.createNewEmptyMidiClip(4, clipSlotId);
// Creates a 4-beat MIDI clip
```
<a name="M4LLib.createNewEmptyClipSlotForTrack"></a>

### M4LLib.createNewEmptyClipSlotForTrack(trackId) ⇒ <code>number</code> \| <code>null</code>
Creates a new empty clip slot for a specified track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the created clip slot, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If track cannot have MIDI clips, clip slot creation fails, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| trackId | <code>string</code> \| <code>number</code> | The track ID to create the clip slot in |

**Example**  
```javascript
const clipSlotId = M4LLib.createNewEmptyClipSlotForTrack(trackId);
```
<a name="M4LLib.getNextEmptyClipSlotIdForTrack"></a>

### M4LLib.getNextEmptyClipSlotIdForTrack(trackId, [start_index]) ⇒ <code>number</code> \| <code>null</code>
Finds the next empty clip slot for a specified track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the next empty clip slot, or null if none found  
**Throws**:

- <code>M4LLibError</code> If track ID is invalid or the track cannot have MIDI clips


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| trackId | <code>string</code> \| <code>number</code> |  | The track ID to search for empty clip slots |
| [start_index] | <code>number</code> | <code>0</code> | The starting index to search from |

**Example**  
```javascript
const emptySlotId = M4LLib.getNextEmptyClipSlotIdForTrack(trackId, 2);
// Starts searching from index 2
```
<a name="M4LLib.createNewSceneAtBottom"></a>

### M4LLib.createNewSceneAtBottom() ⇒ <code>number</code> \| <code>null</code>
Creates a new scene at the bottom of the scene list

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The index of the new scene, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If scene creation fails or the operation fails

<a name="M4LLib.getTrackPathFromPath"></a>

### M4LLib.getTrackPathFromPath(path) ⇒ <code>string</code> \| <code>null</code>
Extracts the track path from a full path string

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> \| <code>null</code> - The track path (e.g., "live_set tracks 0"), or null if invalid  
**Throws**:

- <code>M4LLibError</code> If path is not a string, doesn't contain expected structure, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The full path string (e.g., "live_set tracks 0 clip_slots 0") |

**Example**  
```javascript
const trackPath = M4LLib.getTrackPathFromPath("live_set tracks 0 clip_slots 0");
// Returns: "live_set tracks 0"
```
<a name="M4LLib.getIdFromPath"></a>

### M4LLib.getIdFromPath(path) ⇒ <code>number</code> \| <code>null</code>
Gets the ID from a path

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If path is not a string or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to get the ID from |

<a name="M4LLib.getPathFromId"></a>

### M4LLib.getPathFromId(id) ⇒ <code>string</code> \| <code>null</code>
Gets the path from an object ID

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> \| <code>null</code> - The path of the object, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the object to get the path for |

<a name="M4LLib.getIdFromObject"></a>

### M4LLib.getIdFromObject(object) ⇒ <code>number</code>
Gets the ID from a LiveAPI object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> - The ID of the object  
**Throws**:

- <code>M4LLibError</code> If the object parameter is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The LiveAPI object to get the ID from |

**Example**  
```javascript
const track = new LiveAPI(trackId);
const id = M4LLib.getIdFromObject(track);
track.freepeer();
```
<a name="M4LLib.conformIdArray"></a>

### M4LLib.conformIdArray(id_array) ⇒ <code>Array.&lt;number&gt;</code>
Converts an array of mixed ID formats to an array of numeric IDs

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array.&lt;number&gt;</code> - An array containing only the numeric IDs  

| Param | Type | Description |
| --- | --- | --- |
| id_array | <code>Array</code> | The array of IDs to convert (can be in "id N" format or just numbers) |

<a name="IdObserver"></a>

## IdObserver
IdObserver - A utility class for monitoring Live objects and managing LiveAPI resources

This class implements the Observer pattern for Live objects, automatically managing
LiveAPI lifecycle and providing a clean interface for monitoring changes.

**Kind**: global class  
**Since**: 1.0.0  

* [IdObserver](#IdObserver)
    * [new IdObserver(path, callback, [context], [args])](#new_IdObserver_new)
    * [._createCallbackWrapper()](#IdObserver+_createCallbackWrapper) ⇒ <code>function</code> ℗
    * [.getId()](#IdObserver+getId) ⇒ <code>number</code> \| <code>null</code>
    * [.getPath()](#IdObserver+getPath) ⇒ <code>string</code> \| <code>null</code>
    * [.isActive()](#IdObserver+isActive) ⇒ <code>boolean</code>
    * [.pause()](#IdObserver+pause)
    * [.resume()](#IdObserver+resume)
    * [.destroy()](#IdObserver+destroy)

<a name="new_IdObserver_new"></a>

### new IdObserver(path, callback, [context], [args])
Creates a new IdObserver instance

**Throws**:

- <code>M4LLibError</code> If path is invalid or callback is not a function


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>string</code> |  | The Live path to monitor (e.g., 'live_set view detail_clip') |
| callback | <code>function</code> |  | The function to call when the observed object changes |
| [context] | <code>Object</code> | <code></code> | The context (this) to use when calling the callback |
| [args] | <code>Array</code> | <code>[]</code> | Additional arguments to pass to the callback |

**Example**  
```javascript
// Monitor detail clip changes
const detailClipObserver = new IdObserver(
    'live_set view detail_clip',
    (detailClip) => {
        post('Detail clip changed:', detailClip.id, '\n');
    }
);

// Monitor with context and arguments
const trackObserver = new IdObserver(
    'live_set tracks 0',
    function(track, customArg) {
        post('Track changed:', track.get('name'), 'Custom arg:', customArg, '\n');
    },
    this,
    ['myCustomValue']
);
```
<a name="IdObserver+_createCallbackWrapper"></a>

### idObserver.\_createCallbackWrapper() ⇒ <code>function</code> ℗
Creates a wrapper function that calls the user's callback with proper error handling

**Kind**: instance method of [<code>IdObserver</code>](#IdObserver)  
**Returns**: <code>function</code> - The wrapped callback function  
**Access**: private  
<a name="IdObserver+getId"></a>

### idObserver.getId() ⇒ <code>number</code> \| <code>null</code>
Gets the current ID of the observed object

**Kind**: instance method of [<code>IdObserver</code>](#IdObserver)  
**Returns**: <code>number</code> \| <code>null</code> - The current ID, or null if the observer is inactive  
**Example**  
```javascript
const currentId = detailClipObserver.getId();
if (currentId !== 0) {
    post('Current detail clip ID:', currentId, '\n');
}
```
<a name="IdObserver+getPath"></a>

### idObserver.getPath() ⇒ <code>string</code> \| <code>null</code>
Gets the current path of the observed object

**Kind**: instance method of [<code>IdObserver</code>](#IdObserver)  
**Returns**: <code>string</code> \| <code>null</code> - The current path, or null if the observer is inactive  
**Example**  
```javascript
const currentPath = detailClipObserver.getPath();
post('Current detail clip path:', currentPath, '\n');
```
<a name="IdObserver+isActive"></a>

### idObserver.isActive() ⇒ <code>boolean</code>
Checks if the observer is currently active

**Kind**: instance method of [<code>IdObserver</code>](#IdObserver)  
**Returns**: <code>boolean</code> - True if the observer is active, false otherwise  
**Example**  
```javascript
if (detailClipObserver.isActive()) {
    post('Observer is monitoring detail clip changes\n');
}
```
<a name="IdObserver+pause"></a>

### idObserver.pause()
Temporarily pauses the observer

The observer will stop calling the callback but maintains its LiveAPI connection.
Use resume() to reactivate it.

**Kind**: instance method of [<code>IdObserver</code>](#IdObserver)  
**Example**  
```javascript
detailClipObserver.pause();
// ... do some work that shouldn't trigger callbacks ...
detailClipObserver.resume();
```
<a name="IdObserver+resume"></a>

### idObserver.resume()
Resumes a paused observer

The observer will resume calling the callback when the observed object changes.

**Kind**: instance method of [<code>IdObserver</code>](#IdObserver)  
**Example**  
```javascript
detailClipObserver.resume();
```
<a name="IdObserver+destroy"></a>

### idObserver.destroy()
Destroys the observer and cleans up resources

This method should be called when the observer is no longer needed to prevent
memory leaks and ensure proper cleanup of LiveAPI resources.

**Kind**: instance method of [<code>IdObserver</code>](#IdObserver)  
**Example**  
```javascript
// Clean up when done
detailClipObserver.destroy();
```
<a name="M4LLib"></a>

## .M4LLib
**Kind**: static class  
**Since**: 1.0.0  

* [.M4LLib](#M4LLib)
            * [.conformId(id)](#M4LLib.conformId) ⇒ <code>number</code>
    * [.iterateIds(id_array, callback)](#M4LLib.iterateIds) ⇒ <code>Array</code>
    * [.withLiveAPI(pathOrId, operation, [context], [args], [methodName])](#M4LLib.withLiveAPI) ⇒ <code>\*</code>
    * [.defer(fn, [context], [args], [delay])](#M4LLib.defer)
    * [.conformPathOrId(pathOrId)](#M4LLib.conformPathOrId) ⇒ <code>string</code> \| <code>null</code>
    * [.getItemIndexFromPath(path, itemType)](#M4LLib.getItemIndexFromPath) ⇒ <code>string</code>
    * [.prefixId(numericId)](#M4LLib.prefixId) ⇒ <code>string</code>
    * [.validateId(id, methodName)](#M4LLib.validateId)
    * [.getObjectProperty(object, property)](#M4LLib.getObjectProperty) ⇒ <code>\*</code>
    * [.getObjectInfo(id)](#M4LLib.getObjectInfo) ⇒ <code>Object</code>
    * [.getChildren(id, childClass)](#M4LLib.getChildren) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
    * [.getPropertiesForChildren(id, childClass, [childProperties])](#M4LLib.getPropertiesForChildren) ⇒ <code>Object</code> \| <code>null</code>
    * [.getPropertiesForObjects(idArray, [properties])](#M4LLib.getPropertiesForObjects) ⇒ <code>Object</code> \| <code>null</code>
    * [.getThisDeviceId()](#M4LLib.getThisDeviceId) ⇒ <code>number</code> \| <code>null</code>
    * [.getThisTrackId()](#M4LLib.getThisTrackId) ⇒ <code>number</code> \| <code>null</code>
    * [.navigateToDevice()](#M4LLib.navigateToDevice) ⇒ <code>boolean</code>
    * [.getDeviceParameterNames(deviceId)](#M4LLib.getDeviceParameterNames) ⇒ <code>Object</code> \| <code>null</code>
    * [.getDeviceParameters(deviceId)](#M4LLib.getDeviceParameters) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
    * [.getDeviceParameterInfo(deviceId, [properties])](#M4LLib.getDeviceParameterInfo) ⇒ <code>Object</code> \| <code>null</code>
    * [.getPropertiesForChildren(id, childClass, [childProperties])](#M4LLib.getPropertiesForChildren) ⇒ <code>Object</code> \| <code>null</code>
    * [.getChildren(id, childClass)](#M4LLib.getChildren) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
    * [.getPropertiesForObjects(idArray, [properties])](#M4LLib.getPropertiesForObjects) ⇒ <code>Object</code> \| <code>null</code>
    * [.getObjectProperty(object, property)](#M4LLib.getObjectProperty) ⇒ <code>\*</code>
    * [.getObjectInfo(id)](#M4LLib.getObjectInfo) ⇒ <code>Object</code>
    * [.dumpNotesToNextEmptyClipForTrack(trackId, notes)](#M4LLib.dumpNotesToNextEmptyClipForTrack) ⇒ <code>number</code> \| <code>null</code>
    * [.calculateClipLengthFromNotes(notes)](#M4LLib.calculateClipLengthFromNotes) ⇒ <code>number</code>
    * [.addNotesToClip(clipId, notes)](#M4LLib.addNotesToClip) ⇒ <code>boolean</code>
    * [.createNewEmptyMidiClip(length, clipSlotId)](#M4LLib.createNewEmptyMidiClip) ⇒ <code>number</code> \| <code>null</code>
    * [.createNewEmptyClipSlotForTrack(trackId)](#M4LLib.createNewEmptyClipSlotForTrack) ⇒ <code>number</code> \| <code>null</code>
    * [.getNextEmptyClipSlotIdForTrack(trackId, [start_index])](#M4LLib.getNextEmptyClipSlotIdForTrack) ⇒ <code>number</code> \| <code>null</code>
    * [.createNewSceneAtBottom()](#M4LLib.createNewSceneAtBottom) ⇒ <code>number</code> \| <code>null</code>
    * [.getTrackPathFromPath(path)](#M4LLib.getTrackPathFromPath) ⇒ <code>string</code> \| <code>null</code>
    * [.getIdFromPath(path)](#M4LLib.getIdFromPath) ⇒ <code>number</code> \| <code>null</code>
    * [.getPathFromId(id)](#M4LLib.getPathFromId) ⇒ <code>string</code> \| <code>null</code>
    * [.getIdFromObject(object)](#M4LLib.getIdFromObject) ⇒ <code>number</code>
    * [.conformIdArray(id_array)](#M4LLib.conformIdArray) ⇒ <code>Array.&lt;number&gt;</code>

### M4LLib.conformId(id) ⇒ <code>number</code>
Parses and normalizes various ID formats to a consistent format

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> - The numeric ID  
**Throws**:

- <code>M4LLibError</code> If the id parameter is invalid, cannot be parsed, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> \| <code>Array</code> | The ID to parse (can be string, number, or array) |

**Example**  
```javascript
M4LLib.conformId("id 123");     // Returns: 123
M4LLib.conformId(123);          // Returns: 123
M4LLib.conformId(["id", 123]);  // Returns: 123
M4LLib.conformId([123]);        // Returns: 123
```
<a name="M4LLib.iterateIds"></a>

### M4LLib.iterateIds(id_array, callback) ⇒ <code>Array</code>
Iterates over an array of IDs

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array</code> - An array containing the results of calling the callback function for each ID  

| Param | Type | Description |
| --- | --- | --- |
| id_array | <code>Array</code> | The array of IDs to iterate over (can be in "id N" format or just numbers) |
| callback | <code>function</code> | The function to call for each ID |

**Example**  
```javascript
M4LLib.iterateIds([id, 1, id, 2, id, 3], (id) => {
    post('ID:', id, '\n');
});
```
<a name="M4LLib.withLiveAPI"></a>

### M4LLib.withLiveAPI(pathOrId, operation, [context], [args], [methodName]) ⇒ <code>\*</code>
Executes a function with a LiveAPI object and ensures proper cleanup.
This implements the RAII pattern for LiveAPI objects and works with any Live object type.

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>\*</code> - The return value of the operation function  
**Throws**:

- <code>M4LLibError</code> If the operation fails, LiveAPI creation fails, operation parameter is not a function, or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pathOrId | <code>string</code> \| <code>number</code> |  | The path or ID to create the LiveAPI object from. Numeric IDs are automatically converted to "id N" format for LiveAPI. |
| operation | <code>function</code> |  | The function to execute with the LiveAPI object |
| [context] | <code>Object</code> | <code></code> | The context (this) to use when executing the operation |
| [args] | <code>Array</code> | <code>[]</code> | Arguments to pass to the operation function |
| [methodName] | <code>string</code> | <code>&quot;&#x27;M4LLib.withLiveAPI&#x27;&quot;</code> | The name of the method for error handling |

**Example**  
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

// Work with application view
const viewInfo = M4LLib.withLiveAPI('live_app view', (view) => {
    return view.get('focused_view');
});

// Works with both numeric IDs and "id N" format
const trackName = M4LLib.withLiveAPI(123, (track) => {
    return track.get('name');
});

// With context and arguments
const result = M4LLib.withLiveAPI(trackId, function(track, value) {
    track.set('name', this.prefix + value);
}, { prefix: 'My_' }, [trackName]);
```
<a name="M4LLib.defer"></a>

### M4LLib.defer(fn, [context], [args], [delay])
Schedules a function to be executed with a delay using Max's Task system.
This is useful for avoiding Ableton Live's restrictions on triggering certain operations
in response to notifications.

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Throws**:

- <code>M4LLibError</code> If the function parameter is not a function or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| fn | <code>function</code> |  | The function to execute |
| [context] | <code>Object</code> | <code></code> | The context (this) to use when executing the function |
| [args] | <code>Array</code> | <code>[]</code> | Arguments to pass to the function |
| [delay] | <code>number</code> | <code>0</code> | Delay in milliseconds before execution (default: 0) |

**Example**  
```javascript
// Defer a function call with no delay
M4LLib.defer(() => {
    post("This runs in a lower priority thread\n");
});

// Defer with context and arguments
M4LLib.defer(myFunction, this, [arg1, arg2], 100);
```
<a name="M4LLib.conformPathOrId"></a>

### M4LLib.conformPathOrId(pathOrId) ⇒ <code>string</code> \| <code>null</code>
Validates and normalizes a path or ID

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> \| <code>null</code> - The validated and normalized path or ID, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| pathOrId | <code>string</code> \| <code>number</code> | The path or ID to validate |

<a name="M4LLib.getItemIndexFromPath"></a>

### M4LLib.getItemIndexFromPath(path, itemType) ⇒ <code>string</code>
Gets the index of an item from a path

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> - The index of the item as a string  
**Throws**:

- <code>M4LLibError</code> If the item type is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to get the item index from |
| itemType | <code>string</code> | The type of item to get the index of |

**Example**  
```javascript
const itemIndex = M4LLib.getItemIndexFromPath("live_set tracks 0", "tracks");
// Returns: "0"
```
<a name="M4LLib.prefixId"></a>

### M4LLib.prefixId(numericId) ⇒ <code>string</code>
Adds the "id " prefix to a numeric ID

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> - The ID with "id " prefix  
**Throws**:

- <code>M4LLibError</code> If the numericId parameter is not a number or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| numericId | <code>number</code> | The numeric ID to prefix |

**Example**  
```javascript
M4LLib.prefixId(123); // Returns: "id 123"
```
<a name="M4LLib.validateId"></a>

### M4LLib.validateId(id, methodName)
Validates that an ID is a number

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Throws**:

- <code>M4LLibError</code> If the id parameter is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> \| <code>Array</code> | The ID to validate |
| methodName | <code>string</code> | The name of the calling method for error context |

<a name="M4LLib.getObjectProperty"></a>

### M4LLib.getObjectProperty(object, property) ⇒ <code>\*</code>
Gets a property value from a LiveAPI object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>\*</code> - The property value, or null if the property is not accessible  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The LiveAPI object to get the property from |
| property | <code>string</code> | The name of the property to get |

<a name="M4LLib.getObjectInfo"></a>

### M4LLib.getObjectInfo(id) ⇒ <code>Object</code>
Gets detailed information about a Live object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> - An object containing the parsed info string with properties and their types  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the object to get information for |

<a name="M4LLib.getChildren"></a>

### M4LLib.getChildren(id, childClass) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
Gets the children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array.&lt;number&gt;</code> \| <code>null</code> - An array of child IDs, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the parent object to get children from |
| childClass | <code>string</code> | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |

<a name="M4LLib.getPropertiesForChildren"></a>

### M4LLib.getPropertiesForChildren(id, childClass, [childProperties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for all children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are child IDs and values are objects containing the requested properties, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If the parent ID is invalid, child class is not valid for the parent, or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> \| <code>number</code> |  | The ID of the parent object to get children from |
| childClass | <code>string</code> |  | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |
| [childProperties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve for each child. If null, uses all valid properties |

**Example**  
```javascript
// Get all parameter properties for a device
const deviceParams = M4LLib.getPropertiesForChildren(deviceId, 'parameters');
// Returns: { "id 1": { name: "Volume", value: 0.5 }, "id 2": { name: "Pan", value: 0 } }
```
**Example**  
```javascript
// Get specific properties for track children
const trackInfo = M4LLib.getPropertiesForChildren(liveSetId, 'tracks', ['name', 'color']);
// Returns: { "id 1": { name: "Audio Track", color: 0 }, "id 2": { name: "MIDI Track", color: 1 } }
```
<a name="M4LLib.getPropertiesForObjects"></a>

### M4LLib.getPropertiesForObjects(idArray, [properties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for an array of object IDs

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are object IDs and values are objects containing the requested properties, or null if the operation fails  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| idArray | <code>Array.&lt;number&gt;</code> |  | Array of object IDs to get properties for |
| [properties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve. If null, uses all valid properties |

<a name="M4LLib.getThisDeviceId"></a>

### M4LLib.getThisDeviceId() ⇒ <code>number</code> \| <code>null</code>
Gets the ID of the current device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The device ID, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If the operation fails

<a name="M4LLib.getThisTrackId"></a>

### M4LLib.getThisTrackId() ⇒ <code>number</code> \| <code>null</code>
Gets the track ID of the current device's track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The track ID, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If unable to access the current device or track or if the operation fails

**Example**  
```javascript
const trackId = M4LLib.getThisTrackId();
// Returns: "id 123"
```
<a name="M4LLib.navigateToDevice"></a>

### M4LLib.navigateToDevice() ⇒ <code>boolean</code>
Navigates to the device view

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>boolean</code> - True if the navigation was successful, false otherwise  
**Throws**:

- <code>M4LLibError</code> If device ID is invalid, navigation fails, or the operation fails

<a name="M4LLib.getDeviceParameterNames"></a>

### M4LLib.getDeviceParameterNames(deviceId) ⇒ <code>Object</code> \| <code>null</code>
Gets the names of the parameters for a device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are parameter IDs and values are objects containing {name: string, id: number}, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> \| <code>number</code> | The ID of the device to get the parameters for |

<a name="M4LLib.getDeviceParameters"></a>

### M4LLib.getDeviceParameters(deviceId) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
Gets the parameter IDs for a device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array.&lt;number&gt;</code> \| <code>null</code> - An array of parameter IDs, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>string</code> \| <code>number</code> | The ID of the device to get the parameters for |

<a name="M4LLib.getDeviceParameterInfo"></a>

### M4LLib.getDeviceParameterInfo(deviceId, [properties]) ⇒ <code>Object</code> \| <code>null</code>
Gets parameter information for a device

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are parameter IDs and values are objects containing the requested properties, or null if the operation fails  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| deviceId | <code>string</code> \| <code>number</code> |  | The ID of the device to get the parameters for |
| [properties] | <code>Array.&lt;string&gt;</code> | <code>[]</code> | Array of property names to retrieve for each parameter |

<a name="M4LLib.getPropertiesForChildren"></a>

### M4LLib.getPropertiesForChildren(id, childClass, [childProperties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for all children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are child IDs and values are objects containing the requested properties, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If the parent ID is invalid, child class is not valid for the parent, or the operation fails


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| id | <code>string</code> \| <code>number</code> |  | The ID of the parent object to get children from |
| childClass | <code>string</code> |  | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |
| [childProperties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve for each child. If null, uses all valid properties |

**Example**  
```javascript
// Get all parameter properties for a device
const deviceParams = M4LLib.getPropertiesForChildren(deviceId, 'parameters');
// Returns: { "id 1": { name: "Volume", value: 0.5 }, "id 2": { name: "Pan", value: 0 } }
```
**Example**  
```javascript
// Get specific properties for track children
const trackInfo = M4LLib.getPropertiesForChildren(liveSetId, 'tracks', ['name', 'color']);
// Returns: { "id 1": { name: "Audio Track", color: 0 }, "id 2": { name: "MIDI Track", color: 1 } }
```
<a name="M4LLib.getChildren"></a>

### M4LLib.getChildren(id, childClass) ⇒ <code>Array.&lt;number&gt;</code> \| <code>null</code>
Gets the children of a specified class from a parent object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Array.&lt;number&gt;</code> \| <code>null</code> - An array of child IDs, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the parent object to get children from |
| childClass | <code>string</code> | The class name of the children to retrieve (e.g., 'parameters', 'tracks') |

<a name="M4LLib.getPropertiesForObjects"></a>

### M4LLib.getPropertiesForObjects(idArray, [properties]) ⇒ <code>Object</code> \| <code>null</code>
Gets properties for an array of object IDs

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> \| <code>null</code> - An object where keys are object IDs and values are objects containing the requested properties, or null if the operation fails  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| idArray | <code>Array.&lt;number&gt;</code> |  | Array of object IDs to get properties for |
| [properties] | <code>Array.&lt;string&gt;</code> | <code></code> | Array of property names to retrieve. If null, uses all valid properties |

<a name="M4LLib.getObjectProperty"></a>

### M4LLib.getObjectProperty(object, property) ⇒ <code>\*</code>
Gets a property value from a LiveAPI object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>\*</code> - The property value, or null if the property is not accessible  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>Object</code> | The LiveAPI object to get the property from |
| property | <code>string</code> | The name of the property to get |

<a name="M4LLib.getObjectInfo"></a>

### M4LLib.getObjectInfo(id) ⇒ <code>Object</code>
Gets detailed information about a Live object

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>Object</code> - An object containing the parsed info string with properties and their types  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the object to get information for |

<a name="M4LLib.dumpNotesToNextEmptyClipForTrack"></a>

### M4LLib.dumpNotesToNextEmptyClipForTrack(trackId, notes) ⇒ <code>number</code> \| <code>null</code>
Dumps notes to the next empty clip slot for a specified track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the created clip, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If track cannot have MIDI clips, notes format is invalid, any operation fails, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| trackId | <code>string</code> \| <code>number</code> | The track ID to create the clip in |
| notes | <code>Object</code> | Object containing notes data with 'notes' key |
| notes.notes | <code>Array</code> | Array of note objects to add to the clip |

**Example**  
```javascript
const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
const clipId = M4LLib.dumpNotesToNextEmptyClipForTrack(trackId, notes);
```
<a name="M4LLib.calculateClipLengthFromNotes"></a>

### M4LLib.calculateClipLengthFromNotes(notes) ⇒ <code>number</code>
Calculates the minimal clip length to contain all notes, min 1 beat.

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> - The minimal clip length  
**Throws**:

- <code>M4LLibError</code> If the notes parameter is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| notes | <code>Array</code> | Array of note objects |

<a name="M4LLib.addNotesToClip"></a>

### M4LLib.addNotesToClip(clipId, notes) ⇒ <code>boolean</code>
Adds notes to an existing MIDI clip

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>boolean</code> - True if the notes were added to the clip, false otherwise  
**Throws**:

- <code>M4LLibError</code> If notes object format is invalid, clip ID is invalid or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| clipId | <code>string</code> \| <code>number</code> | The ID of the clip to add notes to |
| notes | <code>Object</code> | Object containing notes data |
| notes.notes | <code>Array</code> | Array of note objects to add |

**Example**  
```javascript
const notes = { notes: [{ pitch: 60, start_time: 0, duration: 1, velocity: 100 }] };
M4LLib.addNotesToClip(clipId, notes);
```
<a name="M4LLib.createNewEmptyMidiClip"></a>

### M4LLib.createNewEmptyMidiClip(length, clipSlotId) ⇒ <code>number</code> \| <code>null</code>
Creates a new empty MIDI clip in a specified clip slot

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the created clip, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If unable to get track path from clip slot path, clip creation fails, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| length | <code>number</code> | The length of the clip in beats |
| clipSlotId | <code>string</code> \| <code>number</code> | The clip slot ID to create the clip in |

**Example**  
```javascript
const clipId = M4LLib.createNewEmptyMidiClip(4, clipSlotId);
// Creates a 4-beat MIDI clip
```
<a name="M4LLib.createNewEmptyClipSlotForTrack"></a>

### M4LLib.createNewEmptyClipSlotForTrack(trackId) ⇒ <code>number</code> \| <code>null</code>
Creates a new empty clip slot for a specified track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the created clip slot, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If track cannot have MIDI clips, clip slot creation fails, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| trackId | <code>string</code> \| <code>number</code> | The track ID to create the clip slot in |

**Example**  
```javascript
const clipSlotId = M4LLib.createNewEmptyClipSlotForTrack(trackId);
```
<a name="M4LLib.getNextEmptyClipSlotIdForTrack"></a>

### M4LLib.getNextEmptyClipSlotIdForTrack(trackId, [start_index]) ⇒ <code>number</code> \| <code>null</code>
Finds the next empty clip slot for a specified track

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID of the next empty clip slot, or null if none found  
**Throws**:

- <code>M4LLibError</code> If track ID is invalid or the track cannot have MIDI clips


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| trackId | <code>string</code> \| <code>number</code> |  | The track ID to search for empty clip slots |
| [start_index] | <code>number</code> | <code>0</code> | The starting index to search from |

**Example**  
```javascript
const emptySlotId = M4LLib.getNextEmptyClipSlotIdForTrack(trackId, 2);
// Starts searching from index 2
```
<a name="M4LLib.createNewSceneAtBottom"></a>

### M4LLib.createNewSceneAtBottom() ⇒ <code>number</code> \| <code>null</code>
Creates a new scene at the bottom of the scene list

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The index of the new scene, or null if creation fails  
**Throws**:

- <code>M4LLibError</code> If scene creation fails or the operation fails

<a name="M4LLib.getTrackPathFromPath"></a>

### M4LLib.getTrackPathFromPath(path) ⇒ <code>string</code> \| <code>null</code>
Extracts the track path from a full path string

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> \| <code>null</code> - The track path (e.g., "live_set tracks 0"), or null if invalid  
**Throws**:

- <code>M4LLibError</code> If path is not a string, doesn't contain expected structure, or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The full path string (e.g., "live_set tracks 0 clip_slots 0") |

**Example**  
```javascript
const trackPath = M4LLib.getTrackPathFromPath("live_set tracks 0 clip_slots 0");
// Returns: "live_set tracks 0"
```
<a name="M4LLib.getIdFromPath"></a>

### M4LLib.getIdFromPath(path) ⇒ <code>number</code> \| <code>null</code>
Gets the ID from a path

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>number</code> \| <code>null</code> - The ID, or null if the operation fails  
**Throws**:

- <code>M4LLibError</code> If path is not a string or the operation fails


| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | The path to get the ID from |

<a name="M4LLib.getPathFromId"></a>

### M4LLib.getPathFromId(id) ⇒ <code>string</code> \| <code>null</code>
Gets the path from an object ID

**Kind**: static method of [<code>M4LLib</code>](#M4LLib)  
**Returns**: <code>string</code> \| <code>null</code> - The path of the object, or null if the operation fails  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The ID of the object to get the path for |

<a name="M4LLib.getIdFromObject">