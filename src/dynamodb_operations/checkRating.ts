import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
const dynamodb = DynamoDBDocumentClient.from(dynamoClient);

// Utility to prompt for user input
const promptUser = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

// Function to check ratings for a package
async function checkRating(packageName: string) {
  try {
    const dbParams = {
      TableName: 'Packages',
      Key: {
        name: packageName, // Use 'name' as the primary key
      },
    };

    const result = await dynamodb.send(new GetCommand(dbParams));
    if (result.Item) {
      console.log('Rating information:', result.Item);
      return result.Item;
    } else {
      console.log(`No rating information found for package: ${packageName}`);
      return null;
    }
  } catch (error) {
    console.error('Error checking ratings:', error);
  }
}

// Sample usage
(async () => {
  const packageName = await promptUser('Enter the package name: ');
  await checkRating(packageName);
})();
