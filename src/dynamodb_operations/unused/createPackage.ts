import { PutCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../../dynamodb";
import readline from 'readline';

// Create an interface for reading from the command line
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input
function askQuestion(query: string): Promise<string> {
    return new Promise(resolve => rl.question(query, resolve));
}

async function createPackage() {
    try {
        // Collect inputs from the user
        const package_id = await askQuestion("Enter package ID: ");
        const name = await askQuestion("Enter package name: ");
        const version = await askQuestion("Enter package version: ");
        const description = await askQuestion("Enter package description: ");

        // Close the readline interface
        //rl.close();

        const params = {
            TableName: "packages_new",
            Item: {
                package_id: package_id,
                name: name,
                version: version,
                description: description
            }
        };

        const command = new PutCommand(params);
        await dynamodb.send(command);
        console.log("Package has been created!");

    } catch (error) {
        console.error("Error creating package:", error);
    }
}

createPackage();
