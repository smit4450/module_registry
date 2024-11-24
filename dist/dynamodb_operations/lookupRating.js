import { S3Client } from '@aws-sdk/client-s3';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb.js';
import dotenv from 'dotenv';
dotenv.config();
// Set up AWS S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
export const lookupRating = async (packageName, packageVersion) => {
    try {
        const scanParams = {
            TableName: "Packages",
            FilterExpression: "#name = :name AND #version = :version",
            ExpressionAttributeNames: {
                "#name": "name",
                "#version": "version",
            },
            ExpressionAttributeValues: {
                ":name": packageName,
                ":version": packageVersion,
            },
        };
        const scanResponse = await dynamodb.send(new ScanCommand(scanParams));
        const Item = scanResponse.Items?.[0];
        if (!Item) {
            throw new Error('Error: Package metadata not found in DynamoDB');
        }
        //console.log(Item); 
        const { bus_factor, correctness, dependency, license, net_score, pull_request, ramp_up, responsiveness, s3_key, size, version, } = Item;
        let data = {
            URL: "",
            NetScore: Number(net_score.toFixed(3)) || 0,
            NetScore_Latency: 0,
            RampUp: Number(ramp_up.toFixed(3)) || 0,
            RampUp_Latency: 0,
            Correctness: Number(correctness.toFixed(3)) || 0,
            Correctness_Latency: 0,
            BusFactor: Number(bus_factor.toFixed(3)) || 0,
            BusFactor_Latency: 0,
            ResponsiveMaintainer: Number(responsiveness.toFixed(3)) || 0,
            ResponsiveMaintainer_Latency: 0,
            License: Number(license.toFixed(3)) || 0,
            License_Latency: 0,
            Depends: Number(dependency.toFixed(3)) || 0,
            Depends_Latency: 0,
            Pull: Number(pull_request.toFixed(3)) || 0,
            Pull_Latency: 0,
        };
        const output = JSON.stringify(data);
        return output;
    }
    catch (error) {
        throw new Error('Error: ' + error);
    }
};
