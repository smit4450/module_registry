import { ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import readline from "readline";
// Set up AWS S3 client
const s3 = new S3Client({});
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
// Set up DynamoDB client
const dynamodb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
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
export const resetRegistry = async () => {
    try {
        console.log("Scanning for packages...");
        const scanParams = {
            TableName: "Packages",
        };
        const scanResponse = await dynamodb.send(new ScanCommand(scanParams));
        if (scanResponse.Items && scanResponse.Items.length > 0) {
            console.log(`Found ${scanResponse.Items.length} packages. Deleting...`);
            for (const item of scanResponse.Items) {
                const packageName = item.name;
                const packageVersion = item.version;
                const s3Key = item.s3_key;
                // Step 1: Delete from S3
                if (s3Key) {
                    const deleteS3Params = {
                        Bucket: BUCKET_NAME,
                        Key: s3Key,
                    };
                    try {
                        await s3.send(new DeleteObjectCommand(deleteS3Params));
                        console.log(`Deleted S3 object: ${s3Key}`);
                    }
                    catch (s3Error) {
                        console.error(`Error deleting S3 object ${s3Key}:`, s3Error);
                    }
                }
                // Step 2: Delete from DynamoDB
                const deleteDbParams = {
                    TableName: "Packages",
                    Key: {
                        name: packageName, // Partition key
                        //version: packageVersion, // Sort key (if applicable)
                    },
                };
                try {
                    await dynamodb.send(new DeleteCommand(deleteDbParams));
                    console.log(`Deleted package: ${packageName} (version: ${packageVersion})`);
                }
                catch (dbError) {
                    console.error(`Error deleting DynamoDB entry for ${packageName}:`, dbError);
                }
            }
            console.log("All packages deleted successfully.");
        }
        else {
            console.log("No packages found to delete.");
        }
    }
    catch (error) {
        console.error("Error during reset operation:", error);
    }
};
