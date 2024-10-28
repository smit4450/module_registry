// models/userModel.js
const dynamoDB = require("../dynamoConfig");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const USER_TABLE = process.env.DYNAMO_DB_USER_TABLE;

// Create a new user
const createUser = async (username, password) => {
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
const getUserByUsername = async (username) => {
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
const validatePassword = async (user, password) => {
  return bcrypt.compare(password, user.password);
};

module.exports = { createUser, getUserByUsername, validatePassword };
