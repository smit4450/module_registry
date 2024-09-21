import { URL } from 'url';
import { url_interface } from './metrics/interfaces.js'; 
import { analyzeNpm } from './api_handler/npm_handler/analyzer_npm.js';
import { analyzeGraphQL } from './api_handler/graphql_handler/analyzer_graphql.js';
import * as readline from 'readline';
import * as fs from 'fs';
// import { TextMetrics } from './metrics/text_metrics.js';
// import * as git_metrics from './metrics/git_metrics.js';
// import * as npm_metrics from './metrics/npm_metrics.js';
import { Metrics } from './metrics/metrics.js';
// Function to validate if the input is a valid URL
function isValidUrl(input: string): boolean {
    try {
        new URL(input);  // If URL constructor doesn't throw, it's valid
        return true;
    } catch (err) {
        return false;
    }
}

async function readLinesFromFile(file_path: string) {
    const fileStream = fs.createReadStream(file_path);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        calculate_factors(line);
    }
}

// Logger function to output analysis results
function logger(message: string) {
    console.log(`[LOG]: ${message}`);
}

function github_url():url_interface {
    console.log("This is a GitHub link.");
    const graphqlResult = analyzeGraphQL();
    console.log(graphqlResult);

    //dummy data for now. Values must be read based on analyzeGraphQL function's logic
    const contributors:number = 1;
    const activity: number=1;
    const documentation: number =1;
    const dependencies: number = 1;

    let url:url_interface;
    url = {bus_factor:0,responsive_maintainer:0,ramp_up:0,correctness:0,license:0,net_score:0};
    const metrics = new Metrics(url,contributors,activity,documentation,dependencies)

    // analyze the data
    metrics.calculate_bus_factor();
    console.log(`Calculated Bus Factor: ${url.bus_factor.toFixed(2)}`);
    return url;

}

function calculate_factors(urlInput:string) {
    console.log(1);
    if (isValidUrl(urlInput)) {
        //console.log(`The URL you provided is valid: ${urlInput}`);
    } 
    else {
        console.error('Error: Invalid URL format.');
        return;
    }

        // console.log('URL validation successful.');

        // console.log("Starting analysis...");

        // This if else statement checks if the link is a github link or a npm link, then calls the appropriate analyze functions.  Then it outputs the result.
    if(urlInput.includes("github.com")){
        var url:url_interface = github_url();
        let data ={
            URL:urlInput,
            NetScore: url.net_score,
            RampUP:url.ramp_up,
            Correctness: url.correctness,
            BusFactor : url.bus_factor,
            License: url.license,
        }
        const output = JSON.stringify(data);
        console.log(output);

        
    }
    else if (urlInput.includes("npmjs.com/package")) {
        //find eqvivalent github link and then call analyzeGraphQL();
        console.log("This is an npm link.");
        // const npmResult = analyzeNpm();
        // console.log(npmResult);

        // // parse through the URL and get data
        // // fake data for now:
        // var m:Metrics = new Metrics()
        // const metrics = new Metrics()

        // // analyze the data
        // const npmMetrics = new NpmMetrics("https://example-npm-package.com");
        // const busFactorValue = npm_metrics.calculateBusFactor(5, 4, 30);
        // console.log(`Calculated NPM Bus Factor: ${busFactorValue.toFixed(2)}`);
    }
    else {
        console.log("This is neither a GitHub nor an npm link.");
        return;
    }     

    console.log("All analyses complete.");

}
// Main function to handle URL input from command line
function main() {
    // Create an interface for input and output streams

    // Prompt user for URL input
    const file_path = process.argv[2];
    readLinesFromFile(file_path)


    // Validate the URL
    
}

// Run the main function
main();

