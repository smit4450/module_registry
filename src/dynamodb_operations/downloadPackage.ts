import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../dynamodb";
import AWS from "aws-sdk";
import readline from "readline";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

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

export const downloadPackage = async (filePath: string, packageName: string) => {
    try {
        const params = {
            TableName: "Packages",
            KeyConditionExpression: "#name = :name",
            ExpressionAttributeNames: {
                "#name": "name", // Use an alias for the reserved keyword "name"
            },
            ExpressionAttributeValues: {
                ":name": packageName,
            },
        };

        const data = await dynamodb.send(new QueryCommand(params));

        if (data.Items && data.Items.length > 0) {
            console.log("Available versions for the package:");
            data.Items.forEach((item, index) => {
                console.log(`${index + 1}. Version: ${item.version}`);
            });

            const versionChoice = await promptUser("Enter the version number you want to download (e.g., 1 for the first version): ");
            const selectedItem = data.Items[parseInt(versionChoice) - 1];
            const s3Key = selectedItem.s3_key;

            // Step 2: Download the file from S3
            const fileContent = await s3.getObject({
                Bucket: BUCKET_NAME!,
                Key: s3Key,
            }).promise();

            // Step 3: Save the file locally
            //const filePath = path.join(__dirname, path.basename(s3Key));
            filePath = path.join(filePath, path.basename(s3Key));
            fs.writeFileSync(filePath, fileContent.Body as Buffer);
            console.log(`Package downloaded successfully: ${filePath}`);
        } else {
            console.log("Package not found with the specified name.");
        }
    } catch (error) {
        console.error("Error downloading package:", error);
    }
};
