import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import * as tar from 'tar';
import dotenv from 'dotenv';

dotenv.config();

// Initialize AWS Clients
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const dynamo = new DynamoDBClient({ region: process.env.AWS_REGION });

// Utility to prompt user input
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

// Function to fetch package metadata from DynamoDB
const fetchPackageMetadata = async (name: string): Promise<any> => {
  const command = new GetCommand({
    TableName: 'Packages',
    Key: { name }, // Use name as the primary key
  });
  const response = await dynamo.send(command);
  return response.Item;
};

// Function to download a file from S3
const downloadFromS3 = async (s3Key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: s3Key,
  });
  const data = await s3.send(command);
  const filePath = path.join(process.cwd(), path.basename(s3Key));
  const fileStream = fs.createWriteStream(filePath);

  await new Promise<void>((resolve, reject) => {
    (data.Body as any).pipe(fileStream).on('finish', resolve).on('error', reject);
  });

  return filePath;
};

// Function to calculate the size of a file
const calculateSize = (filePath: string): number => fs.statSync(filePath).size;

// Function to create a combined archive with dependencies
const createCombinedArchive = async (
  mainPackagePath: string,
  dependenciesPaths: string[]
): Promise<number> => {
  const combinedArchivePath = path.join(process.cwd(), 'combined_package.tgz');

  await tar.create(
    {
      gzip: true,
      file: combinedArchivePath,
    },
    [mainPackagePath, ...dependenciesPaths]
  );

  return calculateSize(combinedArchivePath);
};

// Main Function
export const sizeCost = async (packageName: string, packageVersion: string): Promise<string> => {
  try {
    const metadata = await fetchPackageMetadata(packageName);
    if (!metadata) {
      throw new Error('Package not found in the database.');
    }

    // Check if the version exists in the metadata
    if (metadata.version !== packageVersion) {
      throw new Error(`Version ${packageVersion} not found for package ${packageName}.`);
    }

    //console.log(`S3 key found for package: ${metadata.s3_key}`);
    const mainPackagePath = await downloadFromS3(metadata.s3_key);
    //console.log(`Package downloaded successfully: ${mainPackagePath}`);

    const dependenciesPaths: string[] = []; // Simulating dependency downloads
    //console.log('Dependency Sizes:');
    metadata.dependencies?.forEach((dep: any) => {
      //console.log(`${dep.name}: ${dep.size} bytes`);
      // Simulate downloading each dependency and store its path in dependenciesPaths
      // Example: const depPath = await downloadDependency(dep.s3_key);
      // dependenciesPaths.push(depPath);
    });

    const combinedSize = await createCombinedArchive(mainPackagePath, dependenciesPaths);
    //console.log(`Zipped size of the package with dependencies: ${combinedSize} bytes`);

    const totalSize = metadata.size + dependenciesPaths.reduce((sum, depPath) => sum + calculateSize(depPath), 0);
    //console.log(`Total size including dependencies: ${totalSize} bytes`);

    return totalSize;

  } catch (error) {
    if (error instanceof Error) {
      return `Error: ${error.message}`;
    } else {
      return 'Error';
    }
  }
};