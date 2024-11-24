import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../dynamodb.js";
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

export const retrieveVersions = async (packageName: string): Promise<string> => {
    try {
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
            const versions = data.Items.map((item) => item.version);
            return JSON.stringify({ packageName, versions });
        } else {
            return JSON.stringify({ packageName, versions: [] });
        }
    } catch (error) {
        console.error("Error retrieving versions:", error);
        return JSON.stringify({ error: "Error retrieving versions" });
    }
};
