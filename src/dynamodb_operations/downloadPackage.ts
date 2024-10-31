import fs from 'fs';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
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
        // Get package ID and output path from the user
        const packageId = await promptUser("Enter package ID to download: ");
        const outputPath = await promptUser("Enter path to save the downloaded file: ");

        // Prepare parameters for DynamoDB
        const params = {
            TableName: "Packages",
            Key: {
                package_id: packageId,
            },
        };

        // Fetch from DynamoDB
        const command = new GetCommand(params);
        const response = await dynamodb.send(command);

        if (response.Item && response.Item.content) {
            // Decode content if it's base64 encoded
            const fileContent = Buffer.from(response.Item.content, 'base64');
            fs.writeFileSync(outputPath, fileContent);
            console.log("Package downloaded successfully!");
        } else {
            console.log("Package not found.");
        }
    } catch (error) {
        console.error("Error downloading package:", error);
    }
})();
