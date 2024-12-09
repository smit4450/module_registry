import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import readline from "readline";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

const dynamodb = new DynamoDBClient({});
const s3 = new S3Client({});
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

const streamToString = (stream: Readable): Promise<string> => {
    return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
};

export const downloadPackage = async (package_id: string) => {
    try {
        const scanParams = {
            TableName: "packages_new",
            FilterExpression: "#id = :id",
            ExpressionAttributeNames: {
                "#id": "package_id",
            },
            ExpressionAttributeValues: {
                ":id": package_id,
            },
        };

        const data = await dynamodb.send(new QueryCommand(scanParams));

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
                Bucket: BUCKET_NAME!,
                Key: s3Key,
            }));

            // Step 3: Save the file locally
            const localFilePath = path.join(package_id, path.basename(s3Key));
            if (fileContent.Body) {
                const stream = fileContent.Body as Readable;
                const fileData = await streamToString(stream);
                fs.writeFileSync(localFilePath, fileData);
                console.log(`Package downloaded successfully: ${localFilePath}`);
            } else {
                console.error("Error: fileContent.Body is undefined.");
            }
        } else {
            console.log("Package not found with the specified name.");
        }
    } catch (error) {
        console.error("Error downloading package:", error);
    }
};
