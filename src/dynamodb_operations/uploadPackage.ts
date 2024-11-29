import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import dynamodb from '../dynamodb';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

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

// Function to download the latest npm package
const handleNpmPackage = async (url: string): Promise<string> => {
  try {
    const packageName = url.split('/').pop(); // Extract package name from URL
    console.log(`Downloading npm package ${packageName}...`);
    
    // Run npm pack and capture the output
    const output = execSync(`npm pack ${packageName} --pack-destination .`).toString();
    
    const tgzFileName = output.trim().split('\n').pop(); // Capture the exact file name

    if (!tgzFileName) {
      throw new Error('Failed to locate the downloaded package file');
    }
    
    return path.resolve(tgzFileName);
  } catch (error) {
    console.error(`Failed to download npm package from ${url}`);
    throw error;
  }
};

// Function to calculate the size of a file
const calculateSize = (filePath: string): number => {
  const stats = fs.statSync(filePath);
  return stats.size; // Size in bytes
};

// Generate a numeric ID based on timestamp and random number
const generateNumericId = (): string => {
  const timestamp = Date.now(); // Current timestamp in milliseconds
  const randomNum = Math.floor(Math.random() * 100000); // Generate a random number between 0 and 99999
  return `${timestamp}-${randomNum}`; // Combine timestamp and random number to create a unique ID
};

(async () => {
  try {
    // Prompt for file path or URL
    const source = await promptUser('Enter path to the zipped package file or URL: ');

    let filePath: string;
    let packageSize: number;
    
    if (source.startsWith('http')) {
      // Handle URL (assuming it's an npm package URL)
      filePath = await handleNpmPackage(source);
    } else {
      // Handle local file path
      filePath = source;
    }

    // Calculate the size of the package
    packageSize = calculateSize(filePath);
    console.log(`Package size: ${packageSize} bytes`);

    const fileStream = fs.createReadStream(filePath);

    // Generate a unique numeric ID for the package
    const uniqueId = generateNumericId();
    console.log(`Generated numeric ID for the package: ${uniqueId}`);

    // Prompt for additional metadata
    const packageName = await promptUser('Enter the package name: ');
    const packageVersion = await promptUser('Enter the version label for storage (not actual npm version): ');

    // Upload file to S3
    const s3BucketName = process.env.S3_BUCKET_NAME;
    const s3Key = `packages/${packageName}-${packageVersion}.tgz`;

    const s3UploadParams = {
      Bucket: s3BucketName,
      Key: s3Key,
      Body: fileStream,
    };

    await s3.send(new PutObjectCommand(s3UploadParams));
    console.log(`Package file uploaded to S3 at key: ${s3Key}`);

    // Save metadata to DynamoDB, including the size and zeroed ratings
    const dbParams = {
      TableName: 'Packages',
      Item: {
        package_id: uniqueId,            // Unique numeric ID generated for the package
        name: packageName,              // User-provided package name
        version: packageVersion,        // User-provided version label
        s3_key: s3Key,                  // Reference to the S3 file location
        size: packageSize,              // Package size in bytes
        bus_factor: 0,                  // Ratings set to zero
        responsiveness: 0,
        correctness: 0,
        license: 0,
        ramp_up: 0,
        pull_request: 0,
        dependency: 0,
      },
    };

    await dynamodb.send(new PutCommand(dbParams));
    console.log('Package metadata saved in DynamoDB successfully');

  } catch (error) {
    console.error('Error uploading package:', error);
  }
})();
