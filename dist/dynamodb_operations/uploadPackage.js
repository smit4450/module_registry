import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
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
// Prompt utility
const promptUser = (query) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => rl.question(query, (ans) => {
        rl.close();
        resolve(ans);
    }));
};
// Function to calculate the size of a file
const calculateSize = (filePath) => {
    const stats = fs.statSync(filePath);
    return stats.size; // Size in bytes
};
// Generate a numeric ID based on timestamp and random number
const generateNumericId = () => {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 99999
    return `${timestamp}-${randomNum}`; // Combine timestamp and random number to create a unique ID
};
export const uploadPackage = async (filePath, packageName, packageVersion, rating) => {
    try {
        const packageSize = calculateSize(filePath);
        const fileStream = fs.createReadStream(filePath);
        // Generate a unique numeric ID for the package
        const uniqueId = generateNumericId();
        console.log(`Generated numeric ID for the package: ${uniqueId}`);
        const packageId = path.basename(filePath, path.extname(filePath));
        const s3BucketName = process.env.S3_BUCKET_NAME; // Ensure your bucket name is set in your .env
        const s3Key = `packages/${packageName}-${packageVersion}.tgz`;
        const s3UploadParams = {
            Bucket: s3BucketName,
            Key: s3Key,
            Body: fileStream,
        };
        await s3.send(new PutObjectCommand(s3UploadParams));
        console.log(`Package file uploaded to S3 at key: ${s3Key}`);
        let ratingData;
        try {
            ratingData = JSON.parse(rating);
        }
        catch (error) {
        }
        const busFactor = Number(ratingData.BusFactor) || 0;
        const correctness = Number(ratingData.Correctness) || 0;
        const dependency = Number(ratingData.Depends) || 0;
        const license = Number(ratingData.License) || 0;
        const pullRequest = Number(ratingData.Pull) || 0;
        const rampUp = Number(ratingData.RampUp) || 0;
        const responsiveness = Number(ratingData.ResponsiveMaintainer) || 0;
        const net_score = Number(ratingData.NetScore) || 0;
        // Save metadata to DynamoDB
        const dbParams = {
            TableName: 'Packages',
            Item: {
                package_id: uniqueId, // Unique ID derived from the file name
                name: packageName, // User-provided package name
                version: packageVersion, // User-provided version label
                s3_key: s3Key, // Reference to the S3 file location
                size: packageSize, // Package size in bytes
                bus_factor: busFactor,
                correctness: correctness,
                dependency: dependency,
                license: license,
                pull_request: pullRequest,
                ramp_up: rampUp,
                responsiveness: responsiveness,
                net_score: net_score,
            },
        };
        await dynamodb.send(new PutCommand(dbParams));
        console.log('Package metadata saved in DynamoDB successfully');
    }
    catch (error) {
        console.error('Error uploading package:', error);
    }
};
