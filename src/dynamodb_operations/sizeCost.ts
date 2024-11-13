import { S3Client, HeadObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

// Set up AWS S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Prompt utility to get S3 key from the user
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

// Function to retrieve the size of a file in S3 based on the S3 key
const getPackageSizeFromS3 = async (s3Key: string): Promise<number | null> => {
  try {
    const s3BucketName = process.env.S3_BUCKET_NAME!;
    const command = new HeadObjectCommand({
      Bucket: s3BucketName,
      Key: s3Key,
    });
    
    const response = await s3.send(command);

    // Check if size metadata exists
    if (response.ContentLength !== undefined) {
      console.log(`Package size for S3 key "${s3Key}": ${response.ContentLength} bytes`);
      return response.ContentLength;
    } else {
      console.error("Could not retrieve size information for the specified S3 key.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving package size from S3:", error);
    return null;
  }
};

// Main function to prompt for S3 key and retrieve size
(async () => {
  const s3Key = await promptUser("Enter the S3 key of the package to retrieve its size: ");
  await getPackageSizeFromS3(s3Key);
})();