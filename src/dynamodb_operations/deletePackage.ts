import { ScanCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import dynamodb from "../dynamodb";
import AWS from "aws-sdk";
import readline from "readline";

// Set up AWS S3 client
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

export const deletePackage = async (packageName: string, packageVersion: string) => {
    try {
        // Prompt the user for the package name and version to delete
        //const packageName = await promptUser("Enter the package name to delete: ");
        //const packageVersion = await promptUser("Enter the package version to delete: ");

        // Step 1: Scan the table to find the item with both name and version
        const scanParams = {
            TableName: "Packages",
            FilterExpression: "#name = :name AND #version = :version",
            ExpressionAttributeNames: {
                "#name": "name",
                "#version": "version",
            },
            ExpressionAttributeValues: {
                ":name": packageName,
                ":version": packageVersion,
            },
        };

        const scanResponse = await dynamodb.send(new ScanCommand(scanParams));

        if (scanResponse.Items && scanResponse.Items.length > 0) {
            // Retrieve the S3 key from the item
            const item = scanResponse.Items[0];
            const s3Key = item.s3_key;

            // Step 2: Delete the file from S3
            const deleteS3Params = {
                Bucket: BUCKET_NAME!,
                Key: s3Key,
            };

            await s3.deleteObject(deleteS3Params).promise();
            console.log(`Package file deleted from S3: ${s3Key}`);

            // Step 3: Delete the item from DynamoDB
            const deleteDbParams = {
                TableName: "Packages",
                Key: {
                    name: packageName, // Use only the partition key
                },
            };

            await dynamodb.send(new DeleteCommand(deleteDbParams));
            console.log(`Package with name "${packageName}" and version "${packageVersion}" deleted successfully from DynamoDB.`);
        } else {
            console.log(`No package found with name "${packageName}" and version "${packageVersion}".`);
        }
    } catch (error) {
        console.error("Error deleting package:", error);
    }
};
