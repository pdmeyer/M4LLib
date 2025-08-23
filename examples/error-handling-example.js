/**
 * M4LLib Error Handling Example
 * 
 * This example demonstrates how to use the comprehensive error handling
 * system in M4LLib for robust Max for Live development.
 * 
 * Usage: Include this file in your Max for Live JavaScript object
 */

// Example 1: Basic error handling with try-catch
function demonstrateBasicErrorHandling() {
    try {
        // This will throw a validation error
        const invalidNotes = { wrongKey: [] };
        const clip = new LiveAPI('live_set tracks 0 clip_slots 0');
        
        const result = M4LLib.addNotesToClip(clip, invalidNotes);
        post('Result: ', result, '\n');
        
        clip.freepeer();
    } catch (error) {
        post('Caught error: ', error.message, '\n');
        post('Error code: ', error.code, '\n');
        post('Error context: ', JSON.stringify(error.context), '\n');
    }
}

// Example 2: Using error codes for programmatic handling
function demonstrateErrorCodeHandling() {
    try {
        // Attempt to create a MIDI clip with invalid parameters
        const result = M4LLib.createNewEmptyMidiClip(-1, "invalid_id");
        
    } catch (error) {
        // Handle different error types programmatically
        switch (error.code) {
            case 'VALIDATION_ERROR':
                post('Validation failed: ', error.message, '\n');
                // Could show user-friendly message in Max UI
                break;
                
            case 'INVALID_ID':
                post('ID format error: ', error.message, '\n');
                // Could attempt to fix the ID format
                const fixedId = M4LLib.conformId("id 123");
                post('Fixed ID: ', fixedId, '\n');
                break;
                
            case 'LIVE_API_ERROR':
                post('Live API error: ', error.message, '\n');
                // Could retry operation or show different UI
                break;
                
            default:
                post('Unknown error: ', error.message, '\n');
        }
    }
}

// Example 3: Graceful error handling with fallbacks
function demonstrateGracefulHandling() {
    // Try to get track ID, with fallback
    let trackId;
    
    try {
        trackId = M4LLib.getThisTrackId();
        post('Got track ID: ', trackId, '\n');
    } catch (error) {
        post('Failed to get track ID: ', error.message, '\n');
        // Fallback: try to get first available track
        try {
            trackId = M4LLib.getIdFromPath('live_set tracks 0');
            post('Using fallback track ID: ', trackId, '\n');
        } catch (fallbackError) {
            post('Fallback also failed: ', fallbackError.message, '\n');
            return false;
        }
    }
    
    // Now try to create a clip
    try {
        const notes = {
            notes: [
                { pitch: 60, start_time: 0, duration: 1, velocity: 100 }
            ]
        };
        
        const success = M4LLib.dumpNoteToNextEmptyClipForTrack(trackId, notes, "Test Clip");
        if (success) {
            post('Successfully created test clip!\n');
        } else {
            post('Failed to create test clip\n');
        }
        
    } catch (error) {
        post('Error creating clip: ', error.message, '\n');
        return false;
    }
    
    return true;
}

// Example 4: Custom error handling for specific use cases
function demonstrateCustomErrorHandling() {
    // Create a custom error handler for MIDI operations
    const midiErrorHandler = {
        handle: function(error, context) {
            if (error.code === 'MIDI_OPERATION_ERROR') {
                post('MIDI operation failed: ', error.message, '\n');
                
                // Could implement retry logic
                if (context.retryCount < 3) {
                    post('Retrying... (attempt ', context.retryCount + 1, ')\n');
                    context.retryCount++;
                    // Retry the operation
                    return true; // Indicate retry should happen
                }
            }
            
            // For other errors, use default handling
            M4LLibErrors.ErrorHandler.handle(error, context.method, false);
            return false; // No retry
        }
    };
    
    // Use the custom handler
    try {
        const context = { retryCount: 0, method: 'custom.midi.operation' };
        
        // Simulate a MIDI operation that might fail
        const result = performMidiOperation(context);
        
    } catch (error) {
        const context = { retryCount: 0, method: 'custom.midi.operation' };
        const shouldRetry = midiErrorHandler.handle(error, context);
        
        if (shouldRetry) {
            post('Retry logic would execute here\n');
        }
    }
}

// Example 5: Logging and debugging with error context
function demonstrateErrorLogging() {
    try {
        // Perform some operation that might fail
        const result = performComplexOperation();
        
    } catch (error) {
        // Log detailed error information for debugging
        post('=== ERROR DETAILS ===\n');
        post('Message: ', error.message, '\n');
        post('Code: ', error.code, '\n');
        post('Method: ', error.method, '\n');
        post('Timestamp: ', error.timestamp, '\n');
        post('Context: ', JSON.stringify(error.context, null, 2), '\n');
        post('Stack: ', error.stack, '\n');
        post('===================\n');
        
        // Show user-friendly message
        const userMessage = M4LLibErrors.ErrorHandler.formatUserMessage(error);
        post('User Message: ', userMessage, '\n');
    }
}

// Helper function for examples
function performMidiOperation(context) {
    // Simulate a MIDI operation
    throw new M4LLibErrors.MidiOperationError(
        'Simulated MIDI operation failure',
        { operation: 'test', context: context },
        'performMidiOperation'
    );
}

function performComplexOperation() {
    // Simulate a complex operation that might fail
    throw new M4LLibErrors.LiveApiError(
        'Live API connection failed',
        { 
            operation: 'complex_operation',
            timestamp: new Date().toISOString(),
            details: 'Simulated failure for demonstration'
        },
        'performComplexOperation'
    );
}

// Example 6: Input validation with detailed error messages
function demonstrateInputValidation() {
    try {
        // Validate various input types
        M4LLibErrors.ValidationUtils.validateNumber(42, 'age', 'validateExample');
        M4LLibErrors.ValidationUtils.validateString('hello', 'greeting', 'validateExample');
        M4LLibErrors.ValidationUtils.validateArray([1, 2, 3], 'numbers', 'validateExample');
        
        post('All validations passed!\n');
        
    } catch (error) {
        post('Validation failed: ', error.message, '\n');
        post('Expected: ', error.context.expected, '\n');
        post('Received: ', error.context.received, '\n');
    }
}

// Example 7: Error recovery strategies
function demonstrateErrorRecovery() {
    const recoveryStrategies = {
        'INVALID_ID': function(error) {
            post('Attempting to recover from invalid ID error...\n');
            // Try to convert the ID
            if (error.context.received) {
                const converted = M4LLib.conformId(error.context.received);
                post('Converted ID: ', converted, '\n');
                return converted;
            }
            return null;
        },
        
        'LIVE_API_ERROR': function(error) {
            post('Attempting to recover from Live API error...\n');
            // Wait a bit and retry
            M4LLib.defer(() => {
                post('Retrying operation after delay...\n');
            }, null, [], 1000);
            return null;
        },
        
        'VALIDATION_ERROR': function(error) {
            post('Attempting to recover from validation error...\n');
            // Try to fix common validation issues
            if (error.context.received === null || error.context.received === undefined) {
                post('Using default value for null/undefined parameter\n');
                return 'default_value';
            }
            return null;
        }
    };
    
    try {
        // Simulate an error
        throw new M4LLibErrors.InvalidIdError(
            'Invalid ID format',
            { received: 'invalid_id_string' },
            'recoveryExample'
        );
        
    } catch (error) {
        const strategy = recoveryStrategies[error.code];
        if (strategy) {
            const result = strategy(error);
            if (result) {
                post('Recovery successful, result: ', result, '\n');
            } else {
                post('Recovery attempted but failed\n');
            }
        } else {
            post('No recovery strategy for error code: ', error.code, '\n');
        }
    }
}

// Main function to run all examples
function runAllErrorHandlingExamples() {
    post('=== M4LLib Error Handling Examples ===\n\n');
    
    post('1. Basic Error Handling:\n');
    demonstrateBasicErrorHandling();
    post('\n');
    
    post('2. Error Code Handling:\n');
    demonstrateErrorCodeHandling();
    post('\n');
    
    post('3. Graceful Error Handling:\n');
    demonstrateGracefulHandling();
    post('\n');
    
    post('4. Custom Error Handling:\n');
    demonstrateCustomErrorHandling();
    post('\n');
    
    post('5. Error Logging:\n');
    demonstrateErrorLogging();
    post('\n');
    
    post('6. Input Validation:\n');
    demonstrateInputValidation();
    post('\n');
    
    post('7. Error Recovery:\n');
    demonstrateErrorRecovery();
    post('\n');
    
    post('=== Examples Complete ===\n');
}

// Export functions for use in Max for Live
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        runAllErrorHandlingExamples,
        demonstrateBasicErrorHandling,
        demonstrateErrorCodeHandling,
        demonstrateGracefulHandling,
        demonstrateCustomErrorHandling,
        demonstrateErrorLogging,
        demonstrateInputValidation,
        demonstrateErrorRecovery
    };
}
