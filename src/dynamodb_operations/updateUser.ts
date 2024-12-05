import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';

export const updateUser = async (username: string, updates: any) => {
  const updateExpressionParts: string[] = [];
  const expressionAttributeValues: any = {};

  for (const [key, value] of Object.entries(updates)) {
    updateExpressionParts.push(`#${key} = :${key}`);
    expressionAttributeValues[`:${key}`] = value;
  }

  const params = {
    TableName: 'Users',
    Key: { username },
    UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
    ExpressionAttributeNames: Object.fromEntries(
      Object.keys(updates).map((key) => [`#${key}`, key])
    ),
    ExpressionAttributeValues: expressionAttributeValues,
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
    console.log('User updated successfully.');
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};
