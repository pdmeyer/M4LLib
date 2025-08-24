/**
 * M4LLib Error Classes and Error Handling Utilities
 * 
 * This module provides a simplified error handling system for consistent
 * error handling across the M4LLib library.
 * 
 * @module M4LLibErrors
 */

/**
 * Main error class for all M4LLib errors
 */
class M4LLibError extends Error {
    /**
     * Creates a new M4LLibError
     * 
     * @param {string} message - Error message
     * @param {string} code - Error code for programmatic handling
     * @param {Object} context - Additional context information
     * @param {string} method - Method where error occurred
     */
    constructor(message, code, context = {}, method = '') {
        super(message);
        this.name = 'M4LLibError';
        this.code = code;
        this.context = context;
        this.method = method;
        this.timestamp = new Date().toISOString();
        
        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, M4LLibError);
        }
    }
}

/**
 * Error handler utility class
 */
class ErrorHandler {
    /**
     * Handles errors consistently across the library
     * 
     * @param {Error} error - The error to handle
     * @param {string} method - Method where error occurred
     * @param {boolean} [throwError=true] - Whether to re-throw the error
     * @returns {void}
     */
    static handle(error, method, throwError = true) {
        // Log the error with context
        this.logError(error, method);
        
        // Post error message to Max console
        this.postToMax(error, method);
        
        // Re-throw if requested
        if (throwError) {
            throw error;
        }
    }
    
    /**
     * Logs error details
     * 
     * @param {Error} error - The error to log
     * @param {string} method - Method where error occurred
     */
    static logError(error, method) {
        const errorInfo = {
            name: error.name,
            message: error.message,
            code: error.code || 'UNKNOWN',
            method: method,
            timestamp: error.timestamp || new Date().toISOString(),
            context: error.context || {},
            stack: error.stack
        };
        
        // In a real implementation, you might want to send this to a logging service
        // For now, we'll just post to Max console
        post('M4LLib Error Log: ', JSON.stringify(errorInfo, null, 2), '\n');
    }
    
    /**
     * Posts user-friendly error message to Max console
     * 
     * @param {Error} error - The error to display
     * @param {string} method - Method where error occurred
     */
    static postToMax(error, method) {
        let message = 'M4LLib Error in ' + method + ': ';
        
        if (error instanceof M4LLibError) {
            message += error.message;
            
            // Add helpful context if available
            if (error.context && Object.keys(error.context).length > 0) {
                message += ' (Context: ' + JSON.stringify(error.context) + ')';
            }
        } else {
            message += error.message;
        }
        
        error(message + '\n');
    }
    
    /**
     * Creates a formatted error message for users
     * 
     * @param {Error} error - The error to format
     * @returns {string} Formatted error message
     */
    static formatUserMessage(error) {
        if (error instanceof M4LLibError) {
            let message = error.message;
            
            // Add helpful suggestions based on error code
            switch (error.code) {
                case 'INVALID_ID':
                    message += '\nTip: Use M4LLib.conformId() to convert ID formats.';
                    break;
                case 'VALIDATION_ERROR':
                    message += '\nTip: Check your input parameters and ensure they match the expected format.';
                    break;
                case 'LIVE_API_ERROR':
                    message += '\nTip: Ensure Ableton Live is running and the target object exists.';
                    break;
                case 'MIDI_OPERATION_ERROR':
                    message += '\nTip: Verify the MIDI clip exists and has proper permissions.';
                    break;
                case 'TRACK_OPERATION_ERROR':
                    message += '\nTip: Ensure the track exists and is accessible.';
                    break;
                case 'DEVICE_OPERATION_ERROR':
                    message += '\nTip: Verify the device exists and is properly configured.';
                    break;
            }
            
            return message;
        }
        
        return error.message;
    }
}

/**
 * Validation utilities for common parameter checks
 */
class ValidationUtils {
    /**
     * Validates that a parameter is a number
     * 
     * @param {*} value - Value to validate
     * @param {string} paramName - Name of the parameter for error messages
     * @param {string} method - Method name for error context
     * @throws {M4LLibError} If validation fails
     */
    static validateNumber(value, paramName, method) {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new M4LLibError(
                `Parameter '${paramName}' must be a valid number, got: ${typeof value}`,
                'VALIDATION_ERROR',
                { received: value, expected: 'number' },
                method
            );
        }
    }
    
    /**
     * Validates that a parameter is a string
     * 
     * @param {*} value - Value to validate
     * @param {string} paramName - Name of the parameter for error messages
     * @param {string} method - Method name for error context
     * @throws {M4LLibError} If validation fails
     */
    static validateString(value, paramName, method) {
        if (typeof value !== 'string') {
            throw new M4LLibError(
                `Parameter '${paramName}' must be a string, got: ${typeof value}`,
                'VALIDATION_ERROR',
                { received: value, expected: 'string' },
                method
            );
        }
    }
    
    /**
     * Validates that a parameter is an array
     * 
     * @param {*} value - Value to validate
     * @param {string} paramName - Name of the parameter for error messages
     * @param {string} method - Method name for error context
     * @throws {M4LLibError} If validation fails
     */
    static validateArray(value, paramName, method) {
        if (!Array.isArray(value)) {
            throw new M4LLibError(
                `Parameter '${paramName}' must be an array, got: ${typeof value}`,
                'VALIDATION_ERROR',
                { received: value, expected: 'array' },
                method
            );
        }
    }
    
    /**
     * Validates that a parameter is an object
     * 
     * @param {*} value - Value to validate
     * @param {string} paramName - Name of the parameter for error messages
     * @param {string} method - Method name for error context
     * @throws {M4LLibError} If validation fails
     */
    static validateObject(value, paramName, method) {
        if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw new M4LLibError(
                `Parameter '${paramName}' must be an object, got: ${typeof value}`,
                'VALIDATION_ERROR',
                { received: value, expected: 'object' },
                method
            );
        }
    }
    
    /**
     * Validates that a parameter is a function
     * 
     * @param {*} value - Value to validate
     * @param {string} paramName - Name of the parameter for error messages
     * @param {string} method - Method name for error context
     * @throws {M4LLibError} If validation fails
     */
    static validateFunction(value, paramName, method) {
        if (typeof value !== 'function') {
            throw new M4LLibError(
                `Parameter '${paramName}' must be a function, got: ${typeof value}`,
                'VALIDATION_ERROR',
                { received: value, expected: 'function' },
                method
            );
        }
    }
}

// Export using the Max for Live require system
// This follows the pattern documented in the Max JavaScript User Guide
exports.M4LLibError = M4LLibError;
exports.ErrorHandler = ErrorHandler;
exports.ValidationUtils = ValidationUtils;
