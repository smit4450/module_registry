//Used github copilot to write guideline in pseudocode
// call npm api token from .env file

import minimist = require('minimist');
import dotenv = require('dotenv');

dotenv.config();

const TOKEN = process.env.NPM_TOKEN;

const headers = {
    Authorization: `bearer ${TOKEN}`,
    'Content-Type': 'application/json',
};
const args = minimist(process.argv.slice(2));

interface Metadata {
    description:string;
    time: string;
    dependencies: string;
    versions: string
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


//     a. Read the package.json file from the given path.
//     b. Parse the contents of the package.json file into a JSON object.
//     c. Access the "dependencies" property of the JSON object to get the list of dependencies.

// 4. Return the list of dependencies.

// 5. Call the "readDependencies" function with the path to the npm module as an argument.

// 6. Store the returned list of dependencies in a variable for further processing or display.

// 7. Handle any errors that may occur during the process, such as file not found or invalid JSON format.

// 8. Optionally, you can perform additional operations on the list of dependencies, such as filtering, sorting, or displaying them in a specific format.

// 9. End the program or continue with other tasks as needed.

//test read_dependencies with sample package


const commands = {
    test_data: async () => {
        try {
            const package_url = 'https://www.npmjs.com/package/browserify';
            const package_name = await get_package_name(package_url);
            const metadata = await read_data(String(package_name));
            const downloads = await read_downloads(String(package_name))
            const access_metadata = metadata as Metadata;


        
            console.log(package_name);
            console.log(downloads)
            console.log(access_metadata.versions);
            
            
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