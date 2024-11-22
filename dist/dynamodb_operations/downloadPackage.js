import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import readline from "readline";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
const dynamodb = new DynamoDBClient({});
const s3 = new S3Client({});
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
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
const streamToString = (stream) => {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
};
export const downloadPackage = async (filePath, packageName) => {
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
            const fileContent = await s3.send(new GetObjectCommand({
                Bucket: BUCKET_NAME,
                Key: s3Key,
            }));
            // Step 3: Save the file locally
            const localFilePath = path.join(filePath, path.basename(s3Key));
            if (fileContent.Body) {
                const stream = fileContent.Body;
                const fileData = await streamToString(stream);
                fs.writeFileSync(localFilePath, fileData);
                console.log(`Package downloaded successfully: ${localFilePath}`);
            }
            else {
                console.error("Error: fileContent.Body is undefined.");
            }
        }
        else {
            console.log("Package not found with the specified name.");
        }
    }
    catch (error) {
        console.error("Error downloading package:", error);
    }
};
