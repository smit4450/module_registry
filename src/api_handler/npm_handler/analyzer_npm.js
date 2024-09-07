"use strict";
//Used github copilot to write guideline in pseudocode
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
// 1. Import the necessary modules or libraries for reading the package.json file.
var fs = require("fs");
var minimist = require("minimist");
var args = minimist(process.argv.slice(2));
// 3. Inside the "readDependencies" function:
function read_dependencies(package_url) {
    return __awaiter(this, void 0, void 0, function () {
        var packageJson, packageData, dependencies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readFile(package_url, 'utf-8')];
                case 1:
                    packageJson = _a.sent();
                    packageData = JSON.parse(packageJson);
                    dependencies = packageData.dependencies;
                    // 4. Return the list of dependencies.
                    return [2 /*return*/, dependencies];
            }
        });
    });
}
//     a. Read the package.json file from the given path.
//     b. Parse the contents of the package.json file into a JSON object.
//     c. Access the "dependencies" property of the JSON object to get the list of dependencies.
// 4. Return the list of dependencies.
// 5. Call the "readDependencies" function with the path to the npm module as an argument.
// 6. Store the returned list of dependencies in a variable for further processing or display.
// 7. Handle any errors that may occur during the process, such as file not found or invalid JSON format.
// 8. Optionally, you can perform additional operations on the list of dependencies, such as filtering, sorting, or displaying them in a specific format.
// 9. End the program or continue with other tasks as needed.
//test read_dependencies with sample package
var commands = {
    hello: function () {
        //const dependencies = read_dependencies('https://www.npmjs.com/package/browserify');
        console.log('Hello, world!');
        //console.log(dependencies);
    },
    greet: function () {
        var name = args._[1] || 'Anonymous';
        console.log("Hello, ".concat(name, "!"));
    },
};
var command = args._[0];
if (command && commands[command]) {
    commands[command]();
}
else {
    console.log('Invalid command. Available commands: hello, greet');
}
