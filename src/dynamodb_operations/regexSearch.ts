import fs from 'fs';
import path from 'path';
import * as tar from 'tar';
import { S3Client, GetObjectCommand, ListObjectsV2Command, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper function to list all S3 keys in the specified bucket
const listAllS3Keys = async (): Promise<string[]> => {
  const s3BucketName = process.env.S3_BUCKET_NAME!;
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response: ListObjectsV2CommandOutput = await s3.send(
      new ListObjectsV2Command({
        Bucket: s3BucketName,
        ContinuationToken: continuationToken,
      })
    );

    if (response.Contents) {
      response.Contents.forEach((item) => {
        if (item.Key) keys.push(item.Key);
      });
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return keys;
};

// Function to download and extract README content from S3 object
const downloadReadme = async (s3Key: string): Promise<string | null> => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
    });

    const data = await s3.send(command);

    if (!data.Body) {
      //console.error(`No data found in the S3 response for ${s3Key}.`);
      return null;
    }

    const filePath = path.join(__dirname, path.basename(s3Key));
    const fileStream = fs.createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
      (data.Body as any).pipe(fileStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    const extractedPath = path.join(__dirname, 'extracted');
    if (!fs.existsSync(extractedPath)) {
      fs.mkdirSync(extractedPath);
    }

    await tar.extract({
      file: filePath,
      cwd: extractedPath,
      filter: (filePath) => /README/i.test(filePath),
    });

    const readmeFile = findReadmeFile(extractedPath);
    if (readmeFile) {
      const fileContent = fs.readFileSync(readmeFile, 'utf-8');
      return fileContent;
    } else {
      //console.error(`README file not found in the archive for ${s3Key}.`);
      return null;
    }
  } catch (error) {
    //console.error(`Error downloading or extracting README from S3 for ${s3Key}:`, error);
    return null;
  }
};

// Helper function to search for README files in a directory recursively
const findReadmeFile = (dir: string): string | null => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      const readmeInSubdir = findReadmeFile(filePath);
      if (readmeInSubdir) return readmeInSubdir;
    } else if (/README/i.test(file)) {
      return filePath;
    }
  }
  return null;
};

// Function to search README content with regex
const regexSearchInReadme = (pattern: string, content: string): string[] | null => {
  const regex = new RegExp(pattern, 'g');
  const matches = content.match(regex);
  return matches || null;
};

// Main function to list S3 keys and perform regex search across all packages
export const regexSearch = async (pattern: string, ) => {
  const keys = await listAllS3Keys();
  //console.log(`Searching across ${keys.length} packages...`);

  const foundPackages: { s3Key: string; matchCount: number }[] = [];

  for (const s3Key of keys) {
    //console.log(`Checking package: ${s3Key}`);
    const content = await downloadReadme(s3Key);
    if (content) {
      const matches = regexSearchInReadme(pattern, content);
      if (matches) {
        //console.log(`Found ${matches.length} matches in ${s3Key}`);
        foundPackages.push({ s3Key, matchCount: matches.length });
      } else {
        console.log(`No matches found in ${s3Key}.`);
      }
    }
  }

let result = "";
if (foundPackages.length > 0) {
    foundPackages.forEach((pkg) => {
        result += `- ${pkg.s3Key}: ${pkg.matchCount} matches\n`;
    });
} else {
    return "No matches found in any package.";
}
return result;
};

// Helper function to prompt user input
async function promptUser(query: string): Promise<string> {
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
}

export { regexSearchInReadme, listAllS3Keys };