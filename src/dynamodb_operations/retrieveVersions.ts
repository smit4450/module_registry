import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const promptUser = (query: string): Promise<string> => {
    return new Promise((resolve) => rl.question(query, resolve));
};

const retrieveVersions = async () => {
    try {
        const packageName = await promptUser('Enter package name to retrieve versions: ');

        // Query DynamoDB based on the package name and version
        const params = {
            TableName: 'Packages',
            KeyConditionExpression: 'name = :name',
            ExpressionAttributeValues: {
                ':name': packageName
            }
        };

        const command = new QueryCommand(params);
        const { Items } = await dynamodb.send(command);

        if (Items && Items.length > 0) {
            console.log("Available versions:");
            Items.forEach((item) => {
                console.log(`- ${item.version}`);
            });
        } else {
            console.log("No versions found for this package");
        }
    } catch (error) {
        console.error("Error retrieving versions:", error);
    } finally {
        rl.close();
    }
};

retrieveVersions();
export default retrieveVersions;
