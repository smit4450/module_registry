// Import dependencies using ES module syntax
import dynamoDB from "../dynamoConfig.js";  // Import DynamoDB instance
import { v4 as uuidv4 } from "uuid";       // Import UUID function for unique IDs

// Define the DynamoDB table name from environment variables
const PACKAGE_TABLE = process.env.DYNAMO_DB_PACKAGE_TABLE;

// Create a new package
export const createPackage = async (name, version, filePath) => {
  const packageId = uuidv4();  // Generate a unique package ID
  const params = {
    TableName: PACKAGE_TABLE,
    Item: {
      id: packageId,
      name,
      version,
      filePath,
      createdAt: new Date().toISOString(),
    },
  };
  await dynamoDB.put(params).promise();  // Save the item to DynamoDB
  return params.Item;  // Return the saved item
};

// Get a package by ID
export const getPackageById = async (id) => {
  const params = {
    TableName: PACKAGE_TABLE,
    Key: { id },  // Retrieve item by its primary key (id)
  };
  const result = await dynamoDB.get(params).promise();  // Fetch item from DynamoDB
  return result.Item;  // Return the retrieved item
};

// Update a package by ID
export const updatePackage = async (id, version, filePath) => {
  const params = {
    TableName: PACKAGE_TABLE,
    Key: { id },  // Specify the primary key for the item to update
    UpdateExpression: "set #v = :version, filePath = :filePath",  // Set attributes to update
    ExpressionAttributeNames: { "#v": "version" },  // Alias for version to avoid reserved words
    ExpressionAttributeValues: { ":version": version, ":filePath": filePath },
    ReturnValues: "ALL_NEW",  // Return the updated item after the update
  };
  const result = await dynamoDB.update(params).promise();  // Perform the update operation
  return result.Attributes;  // Return updated attributes
};
