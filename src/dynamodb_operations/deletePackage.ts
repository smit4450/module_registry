import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
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

async function deletePackage() {
    try {
        // Ask for package ID
        const package_id = await askQuestion("Enter the package ID to delete: ");

        // Close the readline interface
        rl.close();

        const params = {
            TableName: "Packages",
            Key: { package_id }
        };

        const command = new DeleteCommand(params);
        await dynamodb.send(command);
        console.log("Package deleted successfully");

    } catch (error) {
        console.error("Error deleting package:", error);
    }
}

deletePackage();
