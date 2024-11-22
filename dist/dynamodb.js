import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";
// Load environment variables
dotenv.config();
// Create an AWS DynamoDB Client with region and credentials
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// Optional: Setup DynamoDB Document Client configuration for auto-marshalling
const translateConfig = {
    marshallOptions: {
        removeUndefinedValues: true, // Removes undefined attributes from data
        convertClassInstanceToMap: true, // Converts class instances to map attributes
    },
};
// Create a DynamoDB Document Client with translation configurations
const dynamodb = DynamoDBDocumentClient.from(client, translateConfig);
export default dynamodb;
