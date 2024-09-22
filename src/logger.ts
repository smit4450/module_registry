import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();

// Enum for log levels
enum LogLevel {
    Silent = 0,
    Info = 1,
    Debug = 2,
}

// Global log level variable, initialized from the .env file or default
let currentLogLevel: LogLevel = parseInt(process.env.LOG_LEVEL || '0') as LogLevel;

// Function to update log level at runtime
function setLogLevel(newLevel: LogLevel) {
    console.log(`Changing log level to: ${newLevel}`);
    currentLogLevel = newLevel;
}

// Function to write log based on the log level
export function log(message: string, level: LogLevel) {
    if (currentLogLevel >= level) {
        const logFilePath = process.env.LOG_FILE || 'app.log'; // Default to 'app.log' if not set
        const logMessage = `${new Date().toISOString()} - ${message}\n`;

        // Ensure directory exists before writing the log
        const directory = path.dirname(logFilePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        // Append the log message to the log file
        fs.appendFileSync(logFilePath, logMessage, 'utf8');

        // Print to the console if log level is 1 or higher
        if (currentLogLevel > LogLevel.Silent) {
            console.log(logMessage);
        }
    }
}

// Example usage of dynamic logging
log('Application starting...', LogLevel.Info);
