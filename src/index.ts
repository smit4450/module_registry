// Import necessary modules
import { URL } from 'url';
import promptSync from 'prompt-sync';

// Function to validate if the input is a valid URL
function isValidUrl(input: string): boolean {
    try {
        new URL(input);  // If URL constructor doesn't throw, it's valid
        return true;
    } catch (err) {
        return false;
    }
}

// Main function to handle URL input from the command line
function main() {
    // Create an instance of prompt-sync
    const prompt = promptSync();

    // Prompt the user for a URL
    const urlInput = prompt('Please enter a URL: ');

    // Validate the URL
    if (isValidUrl(urlInput)) {
        console.log(`The URL you provided is valid: ${urlInput}`);
    } else {
        console.error('Error: Invalid URL format.');
        process.exit(1);  // Exit the process with an error code
    }

    console.log('URL validation successful.');
}

// Run the main function
main();

