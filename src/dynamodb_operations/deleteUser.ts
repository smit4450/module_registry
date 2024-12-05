import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';

export const deleteUser = async (username: string) => {
  const params = {
    TableName: 'Users',
    Key: { username },
  };

  try {
    await dynamodb.send(new DeleteCommand(params));
    console.log('User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
