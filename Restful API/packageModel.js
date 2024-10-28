// models/packageModel.js
const dynamoDB = require("../dynamoConfig");
const { v4: uuidv4 } = require("uuid");

const PACKAGE_TABLE = process.env.DYNAMO_DB_PACKAGE_TABLE;

// Create a new package
const createPackage = async (name, version, filePath) => {
  const packageId = uuidv4();
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
  await dynamoDB.put(params).promise();
  return params.Item;
};

// Get a package by ID
const getPackageById = async (id) => {
  const params = {
    TableName: PACKAGE_TABLE,
    Key: { id },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

// Update a package by ID
const updatePackage = async (id, version, filePath) => {
  const params = {
    TableName: PACKAGE_TABLE,
    Key: { id },
    UpdateExpression: "set #v = :version, filePath = :filePath",
    ExpressionAttributeNames: { "#v": "version" },
    ExpressionAttributeValues: { ":version": version, ":filePath": filePath },
    ReturnValues: "ALL_NEW",
  };
  const result = await dynamoDB.update(params).promise();
  return result.Attributes;
};

module.exports = { createPackage, getPackageById, updatePackage };
