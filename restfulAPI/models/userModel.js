// userModel.js
import dynamoDB from "../dynamoConfig.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";

const USER_TABLE = process.env.DYNAMO_DB_USER_TABLE;

// Create a new user
export const createUser = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = uuidv4();
  
  const params = {
    TableName: USER_TABLE,
    Item: {
      id: userId,
      username,
      password: hashedPassword,
    },
  };

  await dynamoDB.send(new PutCommand(params));   // No .promise() needed in AWS SDK v3
  return params.Item;
};

// Find a user by username
export const getUserByUsername = async (username) => {
  const params = {
    TableName: USER_TABLE,
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: { ":username": username },
  };
  const result = await dynamoDB.send(new QueryCommand(params)); 
  return result.Items[0];
};

// Validate password
export const validatePassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

// Find a user by ID
export const findById = async (id) => {
  const params = {
    TableName: USER_TABLE,
    Key: { id },
  };

  const result = await dynamoDB.get(params);  // No .promise() needed
  return result.Item;
};
