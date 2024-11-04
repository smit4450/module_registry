import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../dynamodb";
import readline from "readline";

// Helper function to prompt the user
const promptUser = (query: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
    }));
};

(async () => {
    try {
        // Prompt the user for the package name
        const packageName = await promptUser("Enter the package name to retrieve versions: ");

        // Step 1: Query DynamoDB for all versions of the package with the specified name
        const params = {
            TableName: "Packages",
            KeyConditionExpression: "#name = :name",
            ExpressionAttributeNames: {
                "#name": "name" // Alias to avoid conflicts with reserved keyword
            },
            ExpressionAttributeValues: {
                ":name": packageName
            }
        };

        const data = await dynamodb.send(new QueryCommand(params));

        if (data.Items && data.Items.length > 0) {
            console.log(`Versions available for package "${packageName}":`);
            data.Items.forEach((item) => {
                console.log(`- Version: ${item.version}`);
            });
        } else {
            console.log("No versions found for the specified package name.");
        }
    } catch (error) {
        console.error("Error retrieving versions:", error);
    }
})();
