//INPUT:
// package name
// package version
//OUTPUT:
// package
// success/failure

import { downloadPackage } from "./dynamodb_operations/downloadPackage";

export function download(filePath: string, packageName: string) {
    //download package from database
    downloadPackage(filePath, packageName);
}