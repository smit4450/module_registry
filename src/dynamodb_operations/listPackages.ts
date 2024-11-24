import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../dynamodb.js";

export const listPackages = async (): Promise<string> => {
    try {
        const params = {
            TableName: "Packages",
        };
        const data = await dynamodb.send(new ScanCommand(params));

        if (data.Items && data.Items.length > 0) {
            const packages = data.Items.map((item, index) => ({
                id: index + 1,
                name: item.name,
                version: item.version,
            }));
            return JSON.stringify(packages);
        } else {
            return JSON.stringify({ message: "No packages found." });
        }
    } catch (error) {
        console.error("Error listing packages:", error);
        return JSON.stringify({ error: "Error listing packages." });
    }
};
