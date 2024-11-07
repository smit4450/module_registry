// Import dependencies using ES module syntax
import dynamoDB from "../dynamoConfig.js";  // Import DynamoDB instance
import { v4 as uuidv4 } from "uuid";       // Import UUID function for unique IDs
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

// Define the DynamoDB table name from environment variables
const PACKAGE_TABLE = process.env.DYNAMO_DB_PACKAGE_TABLE;

// Create a new package
export const createPackage = async (name, version, filePath) => {
  //I NEED TO FIGURE OUT HOW TO UPLOAD THIS FILE TO S3 SLDKJGKLWEJGLKJEWKLJGLKWEJHKLWEJLKGJEWLKGJEW
  //I NEED TO UPLOAD THIS FILE TO S3
  //I NEED TO STORE SOMETHING SO THAT I CAN FIND THIS FILE AGAIN
  //PROBABLY PATH TO THIS FILE IN S3
  //I NEED TO STORE THE PATH TO THIS FILE IN DYNAMODB
  //IF I NEED TO ACCESS THIS FILE AGAIN, THEN I NEED TO RETRIEVE THIS PATH FROM DYNAMODB
  //THEN USING THIS PATH, I NEED TO RETRIEVE THIS FILE FROM S3
  //THEN RETURN IT TO THE USER
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
  await dynamoDB.send(new PutCommand(params)); // No .promise() needed in AWS SDK v3
  return params.Item;  // Return the saved item
};

// Get a package by ID
export const getPackageById = async (id) => {
  const params = {
    TableName: PACKAGE_TABLE,
    Key: { id },  // Retrieve item by its primary key (id)
  };
  const result = await dynamoDB.send(new GetCommand(params));  // No .promise() needed
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
  const result = await dynamoDB.update(params);  // No .promise() needed
  return result.Attributes;  // Return updated attributes
};
