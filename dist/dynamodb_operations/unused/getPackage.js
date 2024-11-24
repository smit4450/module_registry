import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../../dynamodb";
import readline from "readline";
// Helper function to prompt the user
const promptUser = (query) => {
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
        const packageName = await promptUser("Enter the package name to search: ");
        // Query the database for items with the given name
        const params = {
            TableName: "Packages",
            KeyConditionExpression: "#name = :name",
            ExpressionAttributeNames: {
                "#name": "name"
            },
            ExpressionAttributeValues: {
                ":name": packageName
            }
        };
        const data = await dynamodb.send(new QueryCommand(params));
        if (data.Items && data.Items.length > 0) {
            console.log("Packages found:");
            data.Items.forEach((item) => {
                console.log(JSON.stringify(item, null, 2));
            });
        }
        else {
            console.log("No packages found with that name.");
        }
    }
    catch (error) {
        console.error("Error retrieving packages:", error);
    }
})();
