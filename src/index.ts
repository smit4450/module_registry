import { checkRating_url } from './checkRating_url';
import { checkRating } from './checkRating';
//import { getPackageSizeFromS3 } from './dynamodb_operations/sizeCost';
import { retrieveVersions } from "./dynamodb_operations/retrieveVersions";
import { debloat } from './debloat';
import { deletePackage } from "./dynamodb_operations/deletePackage";
import { downloadPackage } from "./dynamodb_operations/downloadPackage";
import { listPackages } from "./dynamodb_operations/listPackages";
import { npmIngestion } from './dynamodb_operations/npmIngestion';
//import { regexSearch } from './regexSearch';
import { uploadPackage } from "./dynamodb_operations/uploadPackage";
import readline from "readline";

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
        const rating = await checkRating_url(url);
        console.log(rating);
        npmIngestion(url, packageName, packageVersion);
    }
    else if(mode == "regex search") {
        //regexSearch();
        console.log("Not imlpemented yet");
    }
    else if(mode == "upload") {
        const filePath = await promptUser("Enter file path: ");
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");
        const rating = await checkRating(filePath);
        console.log(rating);
        uploadPackage(filePath, packageName, packageVersion);
    }
}

main();