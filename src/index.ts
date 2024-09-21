import { URL } from 'url';
import axios = require('axios');
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

async function get_github_url(package_name: string) {
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

function sample(){

    //get random sample of 1000 top depended packages from npm
    
    //get the package name
    //get the package url
    //get the package metadata

}

// Main function to handle URL input from command line
async function main() {
    // Get the URL from the command-line arguments (process.argv[2] is the first argument after 'node' and the script name)
    const urlInput = process.argv[2];
    console.log('URL input:', urlInput)

    if (!urlInput) {
        console.error('Error: Please provide a URL as an argument.');
        process.exit(1);  // Exit the process with an error code
    }

        // Validate the URL
        if (isValidUrl(urlInput)) {
            console.log(`The URL you provided is valid: ${urlInput}`);
        } else {
            console.error('Error: Invalid URL format.');
            //rl.close();  // Close the readline interface
            return;
        }
    
        const package_name = await get_package_name(urlInput);
        const github_url = await get_github_url(String(package_name));
        

    console.log('URL validation successful.')
}

// Run the main function
main();

//test

