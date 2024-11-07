//INPUT:
// package name
// package
// package version
//OUTPUT:
// success/failure

import { uploadPackage } from "./dynamodb_operations/uploadPackage";

export function upload(filePath: string, packageName: string, packageVersion: string) {
    //upload to database
    uploadPackage(filePath, packageName, packageVersion)
}