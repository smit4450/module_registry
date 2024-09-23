import { URL } from 'url';
import { url_interface } from './metrics/interfaces.js'; 
// import { analyzeNpm } from './api_handler/npm_handler/analyzer_npm.js';
// import { analyzeGraphQL } from './api_handler/graphql_handler/analyzer_graphql.js';
import * as readline from 'readline';
import * as fs from 'fs';
import { Metrics } from './metrics/metrics.js';
import axios from 'axios';
import { error } from 'console';
import {log} from './logger.js'
import { fetch_repo, queries } from './api_handler/graphql_handler/analyzer_graphql.js';
import { headers } from './api_handler/graphql_handler/analyzer_graphql.js';
import { query } from './api_handler/graphql_handler/analyzer_graphql.js';
import { GRAPHQL_URL } from './api_handler/graphql_handler/analyzer_graphql.js';
// Function to validate if the input is a valid URL
function isValidUrl(input: string): boolean {
    try {
        new URL(input);  // If URL constructor doesn't throw, it's valid
        return true;
    } catch (err) {
        return false;
    }
}

async function get_package_name (package_url: string) {
    const package_name = package_url.split('/').pop();
    return package_name;
}

async function getGitHubRepoUrl(package_name: string) {
    try {
      const response = await axios.get(`https://registry.npmjs.org/${package_name}`);
      const latest_version = response.data['dist-tags'].latest; //get latest version of package
      const repository = response.data.versions[latest_version].repository; //get the repository URL
      if (repository && repository.url) {
        // Clean up the repository URL (remove "git+" and ".git" if present)
        var gitUrl = repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
        if (gitUrl.startsWith('ssh://git@')) {
            //some urls start with the ssh://git@ prefix 
            console.log("Clean up ssh URL:")
            gitUrl = gitUrl.replace('ssh://git@', 'https://');
          }        
        console.log(`GitHub URL for ${package_name}: ${gitUrl}`);
        return gitUrl;
      } else {
        console.log(`No repository URL found for ${package_name}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching package data for ${package_name}:`, error);
    }
  }

async function fetchRepoUrl(package_url: string) {
    const package_name = await get_package_name(package_url);
    const gitHubUrl = await getGitHubRepoUrl(String(package_name));  // Output is assigned to gitHubUrl
    return gitHubUrl;
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


export async function get_url_interface(urlInput:string):Promise<url_interface> {
    console.log("This is a GitHub link.");
    // const graphqlResult = analyzeGraphQL();
    let url:url_interface;
    let parameters:queries |undefined;
    let metrics:Metrics | undefined;
    console.log("Starting analysis...");
    url = {
        bus_factor:0,
        bus_factor_latency:0,
        responsive_maintainer:0,
        responsive_maintainer_latency:0,
        ramp_up:0,
        ramp_up_latency:0,
        correctness:0,
        correctness_latency:0,
        license:0,
        license_latency:0,
        net_score:0,
        net_score_latency:0,
        disk:0

    };
    console.log("Fetching repository data...");
    try {
        // Call the fetchRepo function
        parameters = await fetch_repo(GRAPHQL_URL, headers, query, 10);
        console.log("Repository data fetched successfully.");

        if (parameters) {
            metrics = new Metrics(url,parameters);
        }
        else {
            console.log("Parameters Not Found")
        }
    
        // analyze the data
        if (metrics) {
            metrics.calculate_bus_factor();
            metrics.calculate_correctness();
            metrics.calculate_rampup();
            metrics.calc_responsive_maintainer();
            metrics.calc_net_score();
            metrics.calc_license()
            console.log(`Calculated Bus Factor: ${url.bus_factor.toFixed(2)}`);
    
        }
        else {
            console.log("Metrics not found")
        }
        return url;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error calling fetchRepo:", error.message); // Log only the error message
        } else {
            console.error("An unknown error occurred."); // Fallback if error is not an instance of Error
        }
    }
    return url


}

export async function calculate_factors(urlInput:string) {
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
        let url:url_interface | undefined;
        url = await get_url_interface(urlInput);
        let data;
        // console.log("getting url")
        if (url) {
            data ={
                URL:urlInput,
                NetScore: url.net_score,
                NetScoreLatency: url.net_score_latency,
                RampUP:url.ramp_up,
                RampUpLatency: url.ramp_up_latency,
                Correctness: url.correctness,
                Correctness_latency: url.correctness_latency,
                BusFactor : url.bus_factor,
                BusFactorLatency : url.bus_factor_latency,
                License: url.license,
                License_latency: url.license_latency,
                ResponsiveMaintainer : url.responsive_maintainer,
                ResponsiveMaintainerLicese :url.responsive_maintainer_latency
            }
        }
        else {
            data = {}
        }
        const output = JSON.stringify(data);
        console.log(output);

        
    }
    else if (urlInput.includes("npmjs.com/package")) {
        //find eqvivalent github link and then call analyzeGraphQL();
        console.log("This is an npm link.");

        // const npmResult = analyzeNpm();
        // console.log(npmResult);
        let url:url_interface | undefined;
        urlInput = String(fetchRepoUrl(urlInput))
        url = await get_url_interface(urlInput);
        let data;
        // console.log("getting url")
        if (url) {
            data ={
                URL:urlInput,
                NetScore: url.net_score,
                RampUP:url.ramp_up,
                Correctness: url.correctness,
                BusFactor : url.bus_factor,
                BusFactorLatency : url.bus_factor_latency,
                License: url.license,
            }
        }
        else {
            data = {}
        }
        const output = JSON.stringify(data);
        console.log(output);


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
    console.log(5);
    
    
}

main()



