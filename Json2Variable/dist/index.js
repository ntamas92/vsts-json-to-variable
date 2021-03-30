"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json2variable_1 = require("./src/json2variable");
const getFSData_1 = require("./src/getFSData");
const argparse_1 = require("argparse");
const asyncWrapper = async () => {
    const parser = new argparse_1.ArgumentParser({
        description: "DeploymentConfig merger"
    });
    parser.add_argument('-f', '--files', { nargs: "+", help: "Input files to merge. The merge order is their precedence." });
    parser.add_argument('-o', '--output', { help: "Output file path. If not provided, only console output will be used." });
    let args = parser.parse_args();
    console.log(args.files);
    let result = await json2variable_1.mergeVariablesInFiles(args.files);
    printVariables(result);
    if (args.output) {
        await getFSData_1.WriteFile(args.output, JSON.stringify(result, null, 2));
    }
};
const printVariables = (variables) => {
    for (let key in variables) {
        console.log(`${key}::${variables[key]}`);
    }
};
asyncWrapper();
//# sourceMappingURL=index.js.map