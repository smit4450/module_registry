import { deletePackage } from "./dynamodb_operations/deletePackage";

export function deletePackageByName(packageName: string, packageVersion: string): void {
    deletePackage(packageName, packageVersion);
}