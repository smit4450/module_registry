import { checkRating_url } from './checkRating_url';
import { checkRating } from './checkRating';
//import { getPackageSizeFromS3 } from './dynamodb_operations/sizeCost';
import { retrieveVersions } from "./dynamodb_operations/retrieveVersions";
import { debloat } from './debloat';
import { deletePackage } from "./dynamodb_operations/deletePackage";
import { downloadPackage } from "./dynamodb_operations/downloadPackage";
import { listPackages } from "./dynamodb_operations/listPackages";
import { npmIngestion } from './dynamodb_operations/npmIngestion';
import { regexSearch } from './dynamodb_operations/regexSearch';
import { uploadPackage } from "./dynamodb_operations/uploadPackage";
import readline from "readline";
import AdmZip from 'adm-zip';
import { checkPackageJson } from './api_handler/graphql_handler/analyzer_graphql';


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
        //checkRating();
        console.log("Not imlpemented yet");
    }
    else if(mode == "check size") {
        //getPackageSizeFromS3()
        console.log("Not imlpemented yet");
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
        const directory = listPackages();
        console.log(directory);
    }
    else if(mode == "npm ingestion") {
        const url = await promptUser("Enter url: ");
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");

        let rating;
        while (true) {
            rating = await checkRating_url(url);;
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
        const key = await promptUser("Enter pattern to search for: ");

        regexSearch(pattern, key);
        console.log("Not imlpemented yet");
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
                rating = await checkRating_url(url);;
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