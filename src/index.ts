import { checkRating_url } from './checkRating_url';
import { checkRating } from './checkRating';
import { checkSize } from './checkSize';
import { checkVersions } from './checkVersions';
import { debloat } from './debloat';
import { deletePackageByName } from './delete';
import { download } from './download';
import { fetchDirectory } from './fetchDirectory';
import { npmIngestion } from './npmIngestion';
import { regexSearch } from './regexSearch';
import { upload } from './upload';
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
        //checkSize();
        console.log("Not imlpemented yet");
    }
    else if(mode == "check versions") {
        const packageName = await promptUser("Enter package name: ");
        const versions = await checkVersions(packageName);
        console.log(versions);
    }
    else if(mode == "debloat") {
        //debloat();
        console.log("Not imlpemented yet");
    }
    else if(mode == "delete") {
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");
        deletePackageByName(packageName, packageVersion);
    }
    else if(mode == "download") {
        const filePath = await promptUser("Enter file path: ");
        const packageName = await promptUser("Enter package name: ");
        download(filePath, packageName);
    }
    else if(mode == "fetch directory") {
        const directory = fetchDirectory();
    }
    else if(mode == "npm ingestion") {
        const url = await promptUser("Enter url: ");
        console.log(await checkRating_url(url));
        //npmIngestion();
    }
    else if(mode == "regex search") {
        //regexSearch();
        console.log("Not imlpemented yet");
    }
    else if(mode == "upload") {
        const filePath = await promptUser("Enter file path: ");
        const packageName = await promptUser("Enter package name: ");
        const packageVersion = await promptUser("Enter package version: ");
        upload(filePath, packageName, packageVersion);
    }
}

main();