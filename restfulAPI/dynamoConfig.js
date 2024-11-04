// Import AWS SDK using ES module syntax
import AWS from "aws-sdk";

// Configure AWS region using environment variables
AWS.config.update({
  region: process.env.AWS_REGION,
});

// Initialize DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Export the configured DynamoDB instance
export default dynamoDB;
