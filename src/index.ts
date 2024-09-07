import { URL } from 'url';
import { analyzeNpm } from './api_handler/npm_handler/analyzer_npm.js';
import { analyzeGraphQL } from './api_handler/graphql_handler/analyzer_graphql.js';
import * as readline from 'readline';

// Function to validate if the input is a valid URL
function isValidUrl(input: string): boolean {
    try {
        new URL(input);  // If URL constructor doesn't throw, it's valid
        return true;
    } catch (err) {
        return false;
    }
}

// Logger function to output analysis results
function logger(message: string) {
    console.log(`[LOG]: ${message}`);
}

// Main function to handle URL input from command line
function main() {
    // Create an interface for input and output streams
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // Prompt user for URL input
    rl.question('Please enter a URL: ', (urlInput) => {
        console.log('URL input:', urlInput);

        if (!urlInput) {
            console.error('Error: No URL provided.');
            rl.close();  // Close the readline interface
            return;
        }

        // Validate the URL
        if (isValidUrl(urlInput)) {
            console.log(`The URL you provided is valid: ${urlInput}`);
        } else {
            console.error('Error: Invalid URL format.');
            rl.close();  // Close the readline interface
            return;
        }

        console.log('URL validation successful.');

        console.log("Starting analysis...");

        const npmResult = analyzeNpm();
        console.log(npmResult);

        const graphqlResult = analyzeGraphQL();
        console.log(graphqlResult);

        console.log("All analyses complete.");

        rl.close();  // Close the readline interface
    });
}

// Run the main function
main();
