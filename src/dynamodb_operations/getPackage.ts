import { GetCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../dynamodb";
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

async function getPackage() {
    try {
        // Ask for package ID
        const package_id = await askQuestion("Enter package ID to retrieve: ");
        
        // Close the readline interface
        rl.close();

        const params = {
            TableName: "Packages",
            Key: {
                package_id: package_id
            }
        };

        const command = new GetCommand(params);
        const result = await dynamodb.send(command);

        if (result.Item) {
            console.log("Package retrieved successfully:", result.Item);
        } else {
            console.log("Package not found.");
        }

    } catch (error) {
        console.error("Error fetching package:", error);
    }
}

getPackage();
