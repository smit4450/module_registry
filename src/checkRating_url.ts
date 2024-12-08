//INPUT:
// package name
// package version
//OUTPUT:
// success/failure


import { URL } from 'url';
import { url_interface } from './metrics/interfaces.js';
import * as readline from 'readline';
import * as fs from 'fs';
import { Metrics } from './metrics/metrics.js';
import axios from 'axios';
import { log } from './logger.js'
import { fetch_repo, queries } from './api_handler/graphql_handler/analyzer_graphql.js';
import { headers } from './api_handler/graphql_handler/analyzer_graphql.js';
import { GRAPHQL_URL } from './api_handler/graphql_handler/analyzer_graphql.js';
import { emptyLogFile } from './logger.js';
// Function to validate if the input is a valid URL
export function isValidUrl(input: string): boolean {
    try {
        new URL(input);  // If URL constructor doesn't throw, it's valid
        return true;
    } catch (err) {
        return false;
    }
}

export async function get_package_name(package_url: string) {
    const package_name = package_url.split('/').pop();
    return package_name;
}

export async function getGitHubRepoUrl(package_name: string) {
    try {
        const response = await axios.get(`https://registry.npmjs.org/${package_name}`);
        const latest_version = response.data['dist-tags'].latest; //get latest version of package
        const repository = response.data.versions[latest_version].repository; //get the repository URL
        if (repository && repository.url) {
            // Clean up the repository URL (remove "git+" and ".git" if present)
            var gitUrl = repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
            if (gitUrl.startsWith('ssh://git@')) {
                //some urls start with the ssh://git@ prefix 
                //console.log("Clean up ssh URL:")
                gitUrl = gitUrl.replace('ssh://git@', 'https://');
            }
            //console.log(`GitHub URL for ${package_name}: ${gitUrl}`);
            return gitUrl;
        } else {

            //console.log(`No repository URL found for ${package_name}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching package data for ${package_name}:`, error);
    }
}

export async function fetchRepoUrl(package_url: string) {
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
        await calculate_factors(line);
    }
}


// Logger function to output analysis results


export async function get_url_interface(urlInput: string): Promise<url_interface> {
    let url: url_interface;
    let parameters: queries | undefined;
    let metrics: Metrics | undefined;

    url = {
        bus_factor: 0,
        bus_factor_latency: 0,
        responsive_maintainer: 0,
        responsive_maintainer_latency: 0,
        ramp_up: 0,
        ramp_up_latency: 0,
        correctness: 0,
        correctness_latency: 0,
        license: 0,
        license_latency: 0,
        depends: 0,
        depends_latency: 0,
        pull: 0,
        pull_latency: 0,
        net_score: 0,
        net_score_latency: 0,
        disk: 0

    };
    try {
        // Call the fetchRepo function
        var start = new Date();
        parameters = await fetch_repo(GRAPHQL_URL, headers, urlInput, start);
        if (parameters) {
            metrics = new Metrics(url, parameters);
        }
        else {
            log("Couldn't locate parameters from repository", 2, "ERROR")
            process.exit(1);
            return url;
        }

        log("Parameters Found", 1, "INFO")
        log("Calculating metrics", 1, "INFO")
        metrics.calculate_bus_factor();
        metrics.calculate_correctness();
        metrics.calculate_rampup();
        metrics.calc_responsive_maintainer();
        metrics.calc_net_score();
        metrics.calc_license();
        metrics.calculate_depends();
        metrics.calculate_pull();

    } catch (error) {
        if (error instanceof Error) {
            log(`Error calling fetchRepo: ${error.message}`, 2, "CRITICAL")
            process.exit(1)
        } else {
            log("Unknwon Error", 2, "Error")
            process.exit(1);

        }
    }
    return url
}

export async function calculate_factors(urlInput: string): Promise<string> {
    if (isValidUrl(urlInput)) {
        console.log(`The URL you provided is valid: ${urlInput}`);
    }
    else {
        log("Invalid URL format", 2, "ERROR")
        process.exit(1);
    }
    log("URL validation successful", 1, "INFO");
    log("Starting Analysis", 1, "INFO");

    // This if else statement checks if the link is a github link or a npm link, then calls the appropriate analyze functions.  Then it outputs the result.
    if (urlInput.includes("github.com")) {
        log("Link is a GitHub URL", 1, "INFO");
        let url: url_interface | undefined;
        url = await get_url_interface(urlInput);
        let data;
        if (url) {
            data = {
                URL: urlInput,
                NetScore: Number(url.net_score.toFixed(3)) || 0,
                NetScore_Latency: Number(url.net_score_latency.toFixed(3)) || 0,
                RampUP: Number(url.ramp_up.toFixed(3)) || 0,
                RampUp_Latency: Number(url.ramp_up_latency.toFixed(3)) || 0,
                Correctness: Number(url.correctness.toFixed(3)) || 0,
                Correctness_Latency: Number(url.correctness_latency.toFixed(3)) || 0,
                BusFactor: Number(url.bus_factor.toFixed(3)) || 0,
                BusFactor_Latency: Number(url.bus_factor_latency.toFixed(3)) || 0,
                ResponsiveMaintainer: Number(url.responsive_maintainer.toFixed(3)) || 0,
                ResponsiveMaintainer_Latency: Number(url.responsive_maintainer_latency.toFixed(3)) || 0,
                License: Number(url.license.toFixed(3)) || 0,
                License_Latency: Number(url.license_latency.toFixed(3)) || 0,
                Depends: Number(url.depends.toFixed(3)) || 0,
                Depends_Latency: Number(url.depends_latency.toFixed(3)) || 0,
                Pull: Number(url.pull.toFixed(3)) || 0,
                Pull_Latency: Number(url.pull_latency.toFixed(3)) || 0,
            }
        }
        else {
            data = {}
        }
        const output = JSON.stringify(data);
        //console.log(output);
        return output;



    }
    else if (urlInput.includes("npmjs.com/package")) {
        //find eqvivalent github link and then call analyzeGraphQL();
        log("Link is an NPM URL", 1, "INFO");
        // const npmResult = analyzeNpm();
        // console.log(npmResult);
        let url: url_interface | undefined;
        urlInput = String(await fetchRepoUrl(urlInput))
        url = await get_url_interface(urlInput);
        let data;
        if (url) {
            data = {
                URL: urlInput,
                NetScore: Number(url.net_score.toFixed(3)) || 0,
                NetScore_Latency: Number(url.net_score_latency.toFixed(3)) || 0,
                RampUP: Number(url.ramp_up.toFixed(3)) || 0,
                RampUp_Latency: Number(url.ramp_up_latency.toFixed(3)) || 0,
                Correctness: Number(url.correctness.toFixed(3)) || 0,
                Correctness_Latency: Number(url.correctness_latency.toFixed(3)) || 0,
                BusFactor: Number(url.bus_factor.toFixed(3)) || 0,
                BusFactor_Latency: Number(url.bus_factor_latency.toFixed(3)) || 0,
                ResponsiveMaintainer: Number(url.responsive_maintainer.toFixed(3)) || 0,
                ResponsiveMaintainer_Latency: Number(url.responsive_maintainer_latency.toFixed(3)) || 0,
                License: Number(url.license.toFixed(3)) || 0,
                License_Latency: Number(url.license_latency.toFixed(3)) || 0,
                Depends: Number(url.depends.toFixed(3)) || 0,
                Depends_Latency: Number(url.depends_latency.toFixed(3)) || 0,
                Pull: Number(url.pull.toFixed(3)) || 0,
                Pull_Latency: Number(url.pull_latency.toFixed(3)) || 0,
            }
        }
        else {
            process.exit(1)
        }
        const output = JSON.stringify(data);
        //console.log(output);
        return output;

    }
    else {
        log("This is neither a GitHub nor an npm url", 2, "WARNING");
        process.exit(1);
        //console.log("This is neither a GitHub nor an npm link.");
        return "Error";
    }


}

/*
// Main function to handle URL input from command line
async function phase_1(url: string): Promise<string>{
    //emptyLogFile();
    log("Starting Process", 1, "INFO");
    const file_path = process.argv[2];
    if (!process.env.LOG_FILE) {
        return false; //process.exit(1);
    }
    try {
        await readLinesFromFile(file_path)
        log("All analyses complete", 1, "INFO")
        return true; //process.exit(0);
    }

    catch (error) {
        if (error instanceof Error) {
            log(`Error during processing: ${error.message}`, 2, "ERROR");
        } else {
            log("An unknown error occurred during processing", 2, "ERROR");
        }
        return false; //process.exit(1); // Exit with failure code
    }
   return ;
}
*/

export async function checkRating_url(url:string): Promise<string> {
    let output = await calculate_factors(url);
    if (output != "Error") {
        return output;
    }
    return "";
}


/*
1. Writes test cases for empty files
2. Configure ./run test
3. Write the coverage percentage
4. Create error checking, add promises, add cases for if parameter cannot be extracted, exiting 0 and 1
5. Run in eceprog
*/