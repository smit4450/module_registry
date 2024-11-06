import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';
import dotenv from 'dotenv';

dotenv.config();

// Set up AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Prompt utility
const promptUser = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

export const uploadPackage = async (filePath: string, packageName: string, packageVersion: string) => {
  try {
    //filePath = await promptUser('Enter path to the zipped package file: ');
    const fileStream = fs.createReadStream(filePath);

    // Automatically derive package ID from the file name
    const packageId = path.basename(filePath, path.extname(filePath));

    // Prompt for additional metadata
    //packageName = await promptUser('Enter the package name: ');
    //packageVersion = await promptUser('Enter the package version: ');

    // Upload file to S3
    const s3BucketName = process.env.S3_BUCKET_NAME; // Ensure your bucket name is set in your .env
    const s3Key = `packages/${packageName}-${packageVersion}.tgz`;

    const s3UploadParams = {
      Bucket: s3BucketName,
      Key: s3Key,
      Body: fileStream,
    };

    await s3.send(new PutObjectCommand(s3UploadParams));
    console.log(`Package file uploaded to S3 at key: ${s3Key}`);

    // Save metadata to DynamoDB
    const dbParams = {
      TableName: 'Packages',
      Item: {
        package_id: packageId, // Unique ID derived from the file name
        name: packageName,      // User-provided package name
        version: packageVersion, // User-provided version
        s3_key: s3Key,          // Reference to the S3 file location
      },
    };

    await dynamodb.send(new PutCommand(dbParams));
    console.log('Package metadata saved in DynamoDB successfully');

  } catch (error) {
    console.error('Error uploading package:', error);
  }
};

uploadPackage('/home/shay/a/john2969/461/module_registry/src/test.zip', 'sam_tester', '1.0.0');