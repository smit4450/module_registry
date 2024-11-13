import fs from 'fs';
import path from 'path';
import * as tar from 'tar';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
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

const downloadReadme = async (s3Key: string): Promise<string | null> => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: s3Key,
    });

    const data = await s3.send(command);

    if (!data.Body) {
      console.error("No data found in the S3 response.");
      return null;
    }

    const filePath = path.join(__dirname, path.basename(s3Key));
    const fileStream = fs.createWriteStream(filePath);

    await new Promise<void>((resolve, reject) => {
      (data.Body as any).pipe(fileStream)
        .on('finish', resolve)
        .on('error', reject);
    });

    // Ensure the file was downloaded correctly
    if (!fs.existsSync(filePath)) {
      console.error("File was not saved correctly.");
      return null;
    }

    const extractedPath = path.join(__dirname, 'extracted');
    if (!fs.existsSync(extractedPath)) {
      fs.mkdirSync(extractedPath);
    }

    // Extract and search for README files
    await tar.extract({
      file: filePath,
      cwd: extractedPath,
      filter: (filePath) => /README/i.test(filePath),
    });

    // Search recursively for any README file in the extracted path
    const readmeFile = findReadmeFile(extractedPath);
    if (readmeFile) {
      const fileContent = fs.readFileSync(readmeFile, 'utf-8');
      console.log(`README file found at ${readmeFile}`);
      return fileContent;
    } else {
      console.error("README file not found in the archive.");
      return null;
    }
  } catch (error) {
    console.error("Error downloading or extracting README from S3:", error);
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
const regexSearch = async (pattern: string, s3Key: string): Promise<string[] | null> => {
  const content = await downloadReadme(s3Key);
  if (content === null) {
    console.error("No content found for regex search.");
    return null;
  }

  const regex = new RegExp(pattern, 'g');
  const matches = content.match(regex);

  if (matches) {
    console.log(`Found ${matches.length} matches:`);
    matches.forEach((match, index) => {
      console.log(`Match ${index + 1}: ${match}`);
    });
  } else {
    console.log("No matches found.");
  }

  return matches || [];
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

// Sample usage
(async () => {
  const s3Key = await promptUser("Enter the S3 key for the README file to search: ");
  const pattern = await promptUser("Enter the regex pattern to search for: ");
  await regexSearch(pattern, s3Key);
})();

export { regexSearch };