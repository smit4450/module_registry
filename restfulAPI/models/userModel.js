// userModel.js
import dynamoDB from "../dynamoConfig.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

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

  await dynamoDB.put(params).promise();
  return params.Item;
};

// Find a user by username
export const getUserByUsername = async (username) => {
  const params = {
    TableName: USER_TABLE,
    IndexName: "username-index",
    KeyConditionExpression: "username = :username",
    ExpressionAttributeValues: { ":username": username },
  };

  const result = await dynamoDB.query(params).promise();
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

  const result = await dynamoDB.get(params).promise();
  return result.Item;
};
