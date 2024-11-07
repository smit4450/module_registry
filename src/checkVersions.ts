//INPUT:
// package name
//OUTPUT:
// success/failure

import { retrieveVersions } from "./dynamodb_operations/retrieveVersions";

export function checkVersions(packageName: string): Promise<string> {
    //check versions from database
    const versions = retrieveVersions(packageName);
    return versions;
}