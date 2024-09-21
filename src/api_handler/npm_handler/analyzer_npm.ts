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

dotenv.config();

const TOKEN = process.env.NPM_TOKEN;

const headers = {
    Authorization: `bearer ${TOKEN}`,
    'Content-Type': 'application/json',
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
//extract package name from url
async function get_package_name (package_url: string) {
    const package_name = package_url.split('/').pop();
    return package_name;
}

// read data from package
async function read_data(extracted_package: string) {
    const endpoint = `https://registry.npmjs.org/${extracted_package}`;

    const res = await fetch(endpoint);
    const metadata= await res.json();
    return metadata;
}

//read metadata related to busfactor (number of contributors)
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