/*
NPM Analyzer: utilities for analyzing NPM packages
Contributors/Sources: 
    GitHub copilot for guidline/syntax issues
    https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md (NPM API documentation)
    https://www.edoardoscibona.com/exploring-the-npm-registry-api (More notes on reading metadata)

To do:
- Score calculations
- main function for scores
- finding data 
*/


// call npm api token from .env file

import minimist = require('minimist');
import dotenv = require('dotenv');
import { StringLiteral } from 'typescript';
import { read } from 'fs';
import axios = require('axios');
import { exec } from 'child_process';
import { promisify } from 'util';
const execPromise = promisify(exec);
=======
// //Used github copilot to write guideline in pseudocode
// // call npm api token from .env file



interface Vulnerabilities {
    high: number;
    critical: number;
}

// dotenv.config();

const TOKEN = process.env.NPM_TOKEN;

const headers = {
    Authorization: `bearer ${TOKEN}`,
    'Content-Type': 'application/json',
};

const defaultVulnerabilities: Vulnerabilities = {
    high: -1,
    critical: -1
  };

const args = minimist(process.argv.slice(2));

interface Metadata {
    description: string;
    time: string;
    dependencies: string;
    versions: Record<string, string>; // Add this line
    license: string;
    homepage: string;
}

async function checkPackageVulnerabilities(packageName: string): Promise<Vulnerabilities> {
    // Hard-code the package name and version if needed
    try {
        console.log(`Checking vulnerabilities for package: ${packageName}`);
  
        // Install the package (remove --package-lock-only flag)
        await execPromise(`npm install ${packageName}`);
  
        // Run npm audit
        const { stdout, stderr } = await execPromise('npm audit --json');
        
        if (stderr) {
            console.error(`stderr: ${stderr}`);
        }

        // Parse the audit results
        const auditResults = JSON.parse(stdout);
        console.log(auditResults.metadata.vulnerabilities);
  
        if (auditResults.metadata && auditResults.metadata.vulnerabilities) {
            const vulnerabilities: Vulnerabilities = auditResults.metadata.vulnerabilities;
            return vulnerabilities;
        } else {
            console.log('No vulnerabilities found.');
            return defaultVulnerabilities;
        }
    } catch (error) {
        console.error(`Error checking vulnerabilities:`);
        return defaultVulnerabilities;
    }
}


//extract package name from url
async function get_package_name (package_url: string) {
    const package_name = package_url.split('/').pop();
    return package_name;
}

// // read data from package
async function read_data(extracted_package: string) {
    const endpoint = `https://registry.npmjs.org/${extracted_package}`;

    const res = await fetch(endpoint);
    const metadata= await res.json();
    return metadata;
}

// //read metadata related to busfactor (number of contributors)
async function read_downloads(extracted_package: string) {
    const endpoint = `https://api.npmjs.org/downloads/point/last-month/${extracted_package}`;

    const res = await fetch(endpoint);
    const downloads= await res.json();
    return downloads;
}
//4. responsive maintainer

//5. licensing
async function read_license(license: string) {
    if(license){
        return 1;}
    return 0;
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

  
/*async function retu */
// async function read_homepage(extracted_package: string) {
//     const endpoint = `https://registry.npmjs.org/${extracted_package}`;
//     const res = await fetch(endpoint);
//     const metadata = await res.json();

//     const gitUrl = repository.url.replace(/^git\+/, '').replace(/\.git$/, '');

//     return homepage;
// }
const commands = {
    test_data: async () => {
        try {
            const package_url = 'https://www.npmjs.com/package/lodash';
// //     a. Read the package.json file from the given path.
// //     b. Parse the contents of the package.json file into a JSON object.
// //     c. Access the "dependencies" property of the JSON object to get the list of dependencies.

// // 4. Return the list of dependencies.

// // 5. Call the "readDependencies" function with the path to the npm module as an argument.

// // 6. Store the returned list of dependencies in a variable for further processing or display.

// // 7. Handle any errors that may occur during the process, such as file not found or invalid JSON format.

// // 8. Optionally, you can perform additional operations on the list of dependencies, such as filtering, sorting, or displaying them in a specific format.

// // 9. End the program or continue with other tasks as needed.

// //test read_dependencies with sample package


const commands = {
    test_data: async () => {
        try {
            const package_url = 'https://www.npmjs.com/package/wasm-grate#wasm-grate';
            const package_name = await get_package_name(package_url);
            getGitHubRepoUrl(String(package_name));
            const metadata = await read_data(String(package_name));
            const downloads = await read_downloads(String(package_name));
            const access_metadata = metadata as Metadata;
            const versionKeys = Object.keys(access_metadata.versions);
            const mostRecentVersion = versionKeys[versionKeys.length - 1];
            const repository = access_metadata.versions[mostRecentVersion];
           // const gitUrl = repository.url.replace(/^git\+/, '').replace(/\.git$/, '');

            //const issues = await read_homepage(String(package_name));

            console.log(access_metadata.homepage);
            console.log(await read_license(access_metadata.license));
            console.log(mostRecentVersion);
            const vulnerabilities:Vulnerabilities = await checkPackageVulnerabilities(String(package_name));
            // console.log(package_name);
            // console.log(downloads)
            // console.log(access_metadata.versions);
            // console.log(vulnerabilities.critical);
            // console.log(vulnerabilities.critical);
                     
        }
        catch (error) {
            console.error('An error occurred:', error);
        }
    },
    dummy_test: () => {
        const name = args._[1] || 'Anonymous';
        console.log(`Hello, ${name}!`);
    },
};

const command = args._[0] as keyof typeof commands;
if (command && commands[command]) {
    commands[command]();
} else {
    console.log('Invalid command. Available commands: test_data, dummy_test');
}

// analyzer_npm.ts

export function analyzeNpm() {
    // Simulating some analysis logic
    console.log("Analyzing NPM packages...");
    return "NPM analysis complete.";
}