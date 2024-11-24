import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { getGitHubRepoUrl } from './metrics/validation.js';
import { lookupRating } from './dynamodb_operations/lookupRating.js';
import { sizeCost } from './dynamodb_operations/sizeCost.js';
import { retrieveVersions } from "./dynamodb_operations/retrieveVersions.js";
import { deletePackage } from "./dynamodb_operations/deletePackage.js";
import { downloadPackage } from "./dynamodb_operations/downloadPackage.js";
import { listPackages } from "./dynamodb_operations/listPackages.js";
import { npmIngestion } from './dynamodb_operations/npmIngestion.js';
import { regexSearch } from './dynamodb_operations/regexSearch.js';
import { uploadPackage } from "./dynamodb_operations/uploadPackage.js";
import { checkRating_url } from './checkRating_url.js';
import { checkRating } from './checkRating.js';
import readline from "readline";
import AdmZip from 'adm-zip';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Example endpoint
app.get('/api/example', (req: Request, res: Response) => {
  res.send('Hello, this is an example endpoint!');
});

// Endpoint to fetch GitHub repository URL
app.get('/api/github-repo-url/:packageName', async (req: Request, res: Response) => {
  const packageName = req.params.packageName;
  try {
    const url = await getGitHubRepoUrl(packageName);
    if (url) {
      res.json({ url });
    } else {
      res.status(404).json({ error: 'Repository URL not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get packages
app.post('/packages', async (req: Request, res: Response) => {
  try {
    const packages = await listPackages();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to reset the registry
app.delete('/reset', (req: Request, res: Response) => {
  // Implement logic to reset the registry
  res.status(200).json({ message: 'Registry reset' });
});

// Endpoint to interact with a package by ID
app.route('/package/:id')
  .get(async (req: Request, res: Response) => {
    const packageName = req.params.id;
    try {
      const versions = await retrieveVersions(packageName);
      res.status(200).json(versions);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .put(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { filePath, packageName, packageVersion } = req.body;
    try {
      const url = await checkForURL(filePath);
      let rating;
      if (url === "Error") {
        while (true) {
          rating = await checkRating(filePath);
          try {
            JSON.parse(rating);
            break;
          } catch (e) {
            console.log("Invalid rating, trying again.");
          }
        }
        await uploadPackage(filePath, packageName, packageVersion, rating);
      } else {
        while (true) {
          rating = await checkRating_url(url);
          try {
            JSON.parse(rating);
            break;
          } catch (e) {
            console.log("Invalid rating, trying again.");
          }
        }
        await npmIngestion(url, packageName, packageVersion, rating);
      }
      res.status(200).json({ message: 'Package updated' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
  .delete(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { packageVersion } = req.body;
    try {
      await deletePackage(id, packageVersion);
      res.status(200).json({ message: 'Package deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Endpoint to create a new package
app.post('/package', async (req: Request, res: Response) => {
  const { filePath, packageName, packageVersion } = req.body;
  try {
    const url = await checkForURL(filePath);
    let rating;
    if (url === "Error") {
      while (true) {
        rating = await checkRating(filePath);
        try {
          JSON.parse(rating);
          break;
        } catch (e) {
          console.log("Invalid rating, trying again.");
        }
      }
      await uploadPackage(filePath, packageName, packageVersion, rating);
    } else {
      while (true) {
        rating = await checkRating_url(url);
        try {
          JSON.parse(rating);
          break;
        } catch (e) {
          console.log("Invalid rating, trying again.");
        }
      }
      await npmIngestion(url, packageName, packageVersion, rating);
    }
    res.status(201).json({ message: 'Package created' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get package rating
app.get('/package/:id/rate', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const rating = await lookupRating(id, 'latest'); // Assuming 'latest' version
    res.status(200).json(rating);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get package cost
app.get('/package/:id/cost', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const cost = await sizeCost(id, 'latest'); // Assuming 'latest' version
    res.status(200).json({ size: cost });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to authenticate user
app.put('/authenticate', (req: Request, res: Response) => {
  // Implement logic to authenticate user and return a token
  res.status(200).json({ token: 'example-token' });
});

// Endpoint to get package history by name
app.get('/package/byName/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const versions = await retrieveVersions(name);
    res.status(200).json(versions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get packages by regex
app.post('/package/byRegEx', async (req: Request, res: Response) => {
  const { pattern } = req.body;
  try {
    const matches = await regexSearch(pattern);
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to get list of tracks
app.get('/tracks', (req: Request, res: Response) => {
  // Implement logic to get list of tracks
  res.status(200).json({ message: 'Get list of tracks' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



// Helper function to check for URL in package
export const checkForURL = (path: string): Promise<string> => {
  const zip = new AdmZip(path);
  const zipEntries = zip.getEntries();

  for (const zipEntry of zipEntries) {
      if (!zipEntry.isDirectory && zipEntry.entryName.split('/').length < 3) {
          const fileName = zipEntry.entryName;
          if (fileName.includes('package.json')) {
              const fileContent = zipEntry.getData().toString('utf8');
              const lines = fileContent.split('\n');
              for (const line of lines) {
                  const urlPattern = /(https?:\/\/(?:www\.)?(github\.com|npmjs\.com)\/[^\s]+)/;
                  const match = line.match(urlPattern);
                  if (match) {
                      return Promise.resolve(match[0]);
                  }
              }
          }
      }
  }
  return Promise.resolve("Error");
}