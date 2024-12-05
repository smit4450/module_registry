import { GetCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';

export const getUser = async (username: string) => {
  const params = {
    TableName: 'Users',
    Key: { username },
  };

  try {
    const result = await dynamodb.send(new GetCommand(params));
    return result.Item;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};
