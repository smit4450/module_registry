//INPUT:
//OUTPUT:
// directory
// success/failure

import { listPackages } from "./dynamodb_operations/listPackages";

export function fetchDirectory(): Promise<string> {
    //fetch directory of all packages from database
    const list = listPackages();
    return list;
}