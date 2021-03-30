"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const processJson = require("./processJson");
const getFSData = require("./getFSData");
exports.mergeVariablesInFiles = async (files) => {
    let filteredVariables = {};
    for (let file of files) {
        let contentObj = JSON.parse(await getFSData.OpenFile(file));
        let result = await processJson.ProcessKeys(contentObj, "", false);
        mergeVariables(filteredVariables, result);
    }
    resolveVariablesInValues(filteredVariables);
    return filteredVariables;
};
const mergeVariables = (existing, current) => {
    for (let key in current) {
        existing[key] = current[key];
    }
};
const resolveVariablesInValues = (variables) => {
    const regex = /\$\([\w\.\-]+\)/g;
    let iteration = 1;
    let replaced = true;
    while (iteration <= 10 && replaced) {
        replaced = false;
        for (let key in variables) {
            let value = variables[key];
            const matches = value.match(regex);
            if (matches) {
                for (let match of matches) {
                    let strippedMatch = match.slice(2, -1);
                    if (strippedMatch in variables) {
                        value = value.replace(match, variables[strippedMatch]);
                        replaced = true;
                    }
                }
            }
            variables[key] = value;
        }
    }
};
// mergeVariablesInFiles()
// var asd: Dictionary<string> = {
//     ["kutya"] : "$(cica)",
//     ["alma"]: "almaalma$(kutya)",
//     ["cica"] : "cicccc"
// }
// resolveVariablesInValues(asd);
// console.log(asd);
// const regex = /\$\([\w\.]+\)/g
// let value = "alma$(sas)asdd$(aaaa)";
// const matches = value.match(regex)
// console.log(matches)
//# sourceMappingURL=json2variable.js.map