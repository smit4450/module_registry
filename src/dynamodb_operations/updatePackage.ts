import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";
import readline from "readline";

// Initialize DynamoDB Client
const client = new DynamoDBClient({ region: "us-east-1" });
const dynamoDb = DynamoDBDocumentClient.from(client);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUser = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

(async () => {
  try {
    // Get user inputs
    const packageId = await promptUser("Enter the package ID to update: ");
    const attributeName = await promptUser("Enter the attribute to update (e.g., name, version): ");
    const newValue = await promptUser(`Enter the new value for ${attributeName}: `);

    // Define update parameters with the correct types
    const params: UpdateCommandInput = {
      TableName: "Packages",
      Key: { package_id: packageId },
      UpdateExpression: `SET #attrName = :attrValue`,
      ExpressionAttributeNames: {
        "#attrName": attributeName,
      },
      ExpressionAttributeValues: {
        ":attrValue": newValue,
      },
      ReturnValues: "UPDATED_NEW",
    };

    // Create and send the UpdateCommand
    const command = new UpdateCommand(params);
    const response = await dynamoDb.send(command);
    console.log("Package updated successfully:", response);

  } catch (error) {
    console.error("Error updating package:", error);
  } finally {
    rl.close();
  }
})();
