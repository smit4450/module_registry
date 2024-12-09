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
export const deletePackage = async (package_id) => {
    try {
        const scanParams = {
            TableName: "packages_new"
        };
        const scanResponse = await dynamodb.send(new ScanCommand(scanParams));
        if (scanResponse.Items && scanResponse.Items.length > 0) {
            // Retrieve the S3 key from the item
            const item = scanResponse.Items[0];
            const s3Key = item.s3_key;
            // Step 2: Delete the file from S3
            const deleteS3Params = {
                Bucket: BUCKET_NAME,
                Key: s3Key,
            };
            await s3.send(new DeleteObjectCommand(deleteS3Params));
            console.log(`Package file deleted from S3: ${s3Key}`);
            // Step 3: Delete the item from DynamoDB
            const deleteDbParams = {
                TableName: "packages_new",
                Key: {
                    package_id: package_id, // Use only the partition key
                },
            };
            await dynamodb.send(new DeleteCommand(deleteDbParams));
            console.log(`Package "${package_id}" deleted successfully from DynamoDB.`);
        }
        else {
            console.log(`No package "${package_id}".`);
        }
    }
    catch (error) {
        console.error("Error deleting package:", error);
    }
};
