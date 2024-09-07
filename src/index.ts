import { URL } from 'url';

// Function to validate if the input is a valid URL
function isValidUrl(input: string): boolean {
    try {
        new URL(input);  // If URL constructor doesn't throw, it's valid
        return true;
    } catch (err) {
        return false;
    }
}

// Main function to handle URL input from command line
function main() {
    // Get the URL from the command-line arguments (process.argv[2] is the first argument after 'node' and the script name)
    const urlInput = process.argv[2];

    if (!urlInput) {
        console.error('Error: Please provide a URL as an argument.');
        process.exit(1);  // Exit the process with an error code
    }

    // Validate the URL
    if (isValidUrl(urlInput)) {
        console.log(`The URL you provided is valid: ${urlInput}`);
    } else {
        console.error('Error: Invalid URL format.');
        process.exit(1);  // Exit the process with an error code
    }
}

// Run the main function
main();