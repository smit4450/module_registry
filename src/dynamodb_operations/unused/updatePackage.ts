import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../../dynamodb";
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
        // Prompt for package name
        const packageName = await promptUser("Enter the package name to update: ");
        const packageVersion = await promptUser("Enter the package version: ");

        // Prompt to ask if user wants to update the name or the version
        const updateChoice = await promptUser("Do you want to update the (1) name or (2) version? Enter 1 or 2: ");

        // Variables to hold new values if they are to be updated
        let newName: string | undefined;
        let newVersion: string | undefined;

        if (updateChoice === "1") {
            // Update the name
            newName = await promptUser("Enter the new package name: ");
        } else if (updateChoice === "2") {
            // Update the version
            newVersion = await promptUser("Enter the new package version: ");
        } else {
            console.log("Invalid choice. Update operation canceled.");
            return;
        }

        // Prepare the update expression based on the choice
        let updateExpression = "SET ";
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};

        if (newName) {
            updateExpression += "#name = :newName";
            expressionAttributeNames["#name"] = "name";
            expressionAttributeValues[":newName"] = newName;
        } else if (newVersion) {
            updateExpression += "#version = :newVersion";
            expressionAttributeNames["#version"] = "version";
            expressionAttributeValues[":newVersion"] = newVersion;
        }

        // Update the item in DynamoDB
        const params = {
            TableName: "Packages",
            Key: {
                name: packageName,        // Partition key (current name)
                version: packageVersion   // Sort key (current version)
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ConditionExpression: "attribute_exists(name) AND attribute_exists(version)", // Ensures item exists
        };

        await dynamodb.send(new UpdateCommand(params));
        console.log(`Package ${newName ? 'name' : 'version'} updated successfully.`);

    } catch (error) {
        console.error("Error updating package:", error);
    }
})();
