import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../dynamodb.js";
export const listPackages = async () => {
    try {
        const params = {
            TableName: "packages_new",
        };
        const data = await dynamodb.send(new ScanCommand(params));
        if (data.Items && data.Items.length > 0) {
            const packages = data.Items.map((item, index) => ({
                Name: item.name,
                Version: item.version,
                ID: item.package_id,
            }));
            return packages;
        }
        else {
            return { message: "No packages found." };
        }
    }
    catch (error) {
        console.error("Error listing packages:", error);
        return { error: "Error listing packages." };
    }
};
