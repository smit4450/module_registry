import fs from 'fs';
import path from 'path';
import readline from 'readline';
import * as tar from 'tar';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

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

// Function to extract and calculate the sizes of files inside the .tgz package
const calculatePackageContentsSize = async (tgzFilePath: string) => {
  const extractedPath = path.join(__dirname, 'extracted');
  
  // Ensure the extracted directory exists
  if (!fs.existsSync(extractedPath)) {
    fs.mkdirSync(extractedPath);
  }

  // Extract the .tgz file
  await tar.x({
    file: tgzFilePath,
    cwd: extractedPath,
  });

  // Calculate sizes of each file in the extracted directory
  let totalSize = 0;
  const fileSizes: Record<string, number> = {};

  const walkDirectory = (dir: string) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        walkDirectory(filePath);
      } else {
        const relativePath = path.relative(extractedPath, filePath);
        fileSizes[relativePath] = stats.size;
        totalSize += stats.size;
      }
    }
  };

  walkDirectory(extractedPath);

  // Display each file’s size
  console.log("\nPackage Contents and Sizes:");
  for (const [fileName, size] of Object.entries(fileSizes)) {
    console.log(`- ${fileName}: ${size} bytes`);
  }

  // Display total size
  console.log(`\nTotal size of ${path.basename(tgzFilePath)}: ${totalSize} bytes`);
};

// Sample usage
(async () => {
  const packageUrl = await promptUser("Enter the npm package URL: ");
  const tgzFilePath = await handleNpmPackage(packageUrl);
  await calculatePackageContentsSize(tgzFilePath);
})();
