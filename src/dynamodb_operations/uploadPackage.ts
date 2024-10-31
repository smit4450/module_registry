import fs from 'fs';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';
import readline from 'readline';

// Prompt user function to get input directly
function promptUser(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    }));
}

(async () => {
    try {
        // Get package details from the user
        const packageId = await promptUser("Enter package ID: ");
        const packageName = await promptUser("Enter package name: ");
        const version = await promptUser("Enter version: ");
        const filePath = await promptUser("Enter path to the zipped package file: ");

        // Read the file content (simulating a zipped file)
        const fileContent = fs.readFileSync(filePath);

        // Prepare parameters for DynamoDB
        const params = {
            TableName: "Packages",
            Item: {
                package_id: packageId,
                name: packageName,
                version: version,
                content: fileContent.toString('base64'), // Store as base64 if needed
            },
        };

        // Upload to DynamoDB
        const command = new PutCommand(params);
        await dynamodb.send(command);

        console.log("Package uploaded successfully!");
    } catch (error) {
        console.error("Error uploading package:", error);
    }
})();
