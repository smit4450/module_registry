import { checkRating, get_package_name } from './checkRating';
import { checkSize } from './checkSize';
import { checkVersions } from './checkVersions';
import { debloat } from './debloat';
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
    console.log("Enter mode: \n");
    console.log("check rating\n");
    console.log("check size\n");
    console.log("check versions\n");
    console.log("debloat\n");
    console.log("download\n");
    console.log("fetch directory\n");
    console.log("npm ingestion\n");
    console.log("regex search\n");
    console.log("upload\n");
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
    else if(mode == "download") {
        const filePath = await promptUser("Enter file path: ");
        const packageName = await promptUser("Enter package name: ");
        download(filePath, packageName);
    }
    else if(mode == "fetch directory") {
        const directory = fetchDirectory();
    }
    else if(mode == "npm ingestion") {
        //npmIngestion();
        console.log("Not imlpemented yet");
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