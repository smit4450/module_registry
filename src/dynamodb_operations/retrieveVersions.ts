import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from '../dynamodb.js';
import readline from "readline";

export const retrieveVersions = async (packageName: string) => {
    try {
        const params = {
            TableName: "packages_new",
            IndexName: "name-index", // Name of the GSI
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
            // -------- WORKS -------
            return { packageName, versions };
        } else {
            return { packageName, versions: []};
            // ----------------------
        }
    } catch (error) {
        console.error("Error retrieving versions:", error);
        return JSON.stringify({ error: "Error retrieving versions" });
    }
};
