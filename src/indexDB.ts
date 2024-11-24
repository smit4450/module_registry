import { checkRating_url, get_package_name } from './checkRating_url.js';
import { lookupRating } from './dynamodb_operations/lookupRating.js';
import { checkRating } from './checkRating.js';
import { sizeCost } from './dynamodb_operations/sizeCost.js';
import { retrieveVersions } from "./dynamodb_operations/retrieveVersions.js";
import { debloat } from './debloat.js';
import { deletePackage } from "./dynamodb_operations/deletePackage.js";
import { downloadPackage } from "./dynamodb_operations/downloadPackage.js";
import { listPackages } from "./dynamodb_operations/listPackages.js";
import { npmIngestion } from './dynamodb_operations/npmIngestion.js';
import { regexSearch } from './dynamodb_operations/regexSearch.js';
import { uploadPackage } from "./dynamodb_operations/uploadPackage.js";
import readline from "readline";
import AdmZip from 'adm-zip';
import { checkPackageJson } from './api_handler/graphql_handler/analyzer_graphql.js';


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

const checkForURL = (path: string): Promise<string> => {
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

export async function main() {
    console.log("check rating");
    console.log("check size");
    console.log("check versions");
    console.log("debloat");
    console.log("delete");
    console.log("download");
    console.log("fetch directory");
    console.log("npm ingestion");
    console.log("regex search");
    console.log("upload");
    const mode = await promptUser("Enter mode: ");


    if(mode == "check rating") {
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");
        const rating = await lookupRating(packageName, packageVersion);
        if (rating.toString().startsWith("Error")) {
            console.log(rating);
        } else {
            console.log(rating);
        }
        
    }
    else if(mode == "check size") {
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");
        const size = await sizeCost(packageName, packageVersion);
        if (size.toString().startsWith("Error")) {
            console.log(size);
        } else {
            console.log("Size: " + size + " bytes");
        }
        
    }
    else if(mode == "check versions") {
        const packageName = await promptUser("Enter package name: ");
        const versions = await retrieveVersions(packageName);
        console.log(versions);
    }
    else if(mode == "debloat") {
        //debloat();
        console.log("Not imlpemented yet");
    }
    else if(mode == "delete") {
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");
        deletePackage(packageName, packageVersion);
    }
    else if(mode == "download") {
        const filePath = await promptUser("Enter file path: ");
        const packageName = await promptUser("Enter package name: ");
        downloadPackage(filePath, packageName);
    }
    else if(mode == "fetch directory") {
        const directory = await listPackages();
        console.log(directory);
    }
    else if(mode == "npm ingestion") {
        const url = await promptUser("Enter url: ");
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");

        let rating;
        while (true) {
            console.log("Checking rating...");
            rating = await checkRating_url(url);
            console.log("Rating: " + rating);
            try {
            JSON.parse(rating);
            break;
            } catch (e) {
            console.log("Invalid rating, trying again.");
            }
        }

        console.log(rating);
        let ratingData;
        try {
        ratingData = JSON.parse(rating);
        } catch (error) {
        }
        const net_score = Number(ratingData.NetScore) || 0;
        if(net_score >= 0.5) {
            npmIngestion(url, packageName, packageVersion, rating);
        }
        else {
            console.log("Rating net score " + net_score + " is less than 0.5, package will not be ingested.");
        }
    }
    else if(mode == "regex search") {
        const pattern = await promptUser("Enter pattern to search for: ");

        const matches = await regexSearch(pattern);
        console.log(matches);
    }
    else if(mode == "upload") {
        const filePath = await promptUser("Enter file path: ");
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");

        const url = await checkForURL(filePath);
        if(url == "Error") {
            let rating;
            while (true) {
                rating = await checkRating(filePath);
                try {
                JSON.parse(rating);
                break;
                } catch (e) {
                console.log("Invalid rating, trying again.");
                }
            }
            console.log(rating);
            uploadPackage(filePath, packageName, packageVersion, rating);
        }
        else {
            let rating;
            while (true) {
                rating = await checkRating_url(url);
                try {
                JSON.parse(rating);
                break;
                } catch (e) {
                console.log("Invalid rating, trying again.");
                }
            }
            console.log(rating);
            npmIngestion(url, packageName, packageVersion, rating);
        }

    }
}

main();