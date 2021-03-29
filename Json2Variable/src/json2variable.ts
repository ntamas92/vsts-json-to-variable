import * as processJson from './processJson';
import * as getFSData from './getFSData';
import { Dictionary } from './common';

export const mergeVariablesInFiles = async (files: string[]) : Promise<Dictionary<string>> => {
        let filteredVariables: Dictionary<string> = {}

        for (let file of files) {
            let contentObj = JSON.parse(await getFSData.OpenFile(file));

            let result = await processJson.ProcessKeys(contentObj, "", false);

            mergeVariables(filteredVariables, result)
        }

        resolveVariablesInValues(filteredVariables);

        console.log("printing variables:")
        printVariables(filteredVariables)

        return filteredVariables;
}

const mergeVariables = (existing: Dictionary<string>, current: Dictionary<string>) => {
    for (let key in current) {
        existing[key] = current[key]
    }
}

const printVariables = (variables: Dictionary<string>) => {
    for (let key in variables) {
        console.log(`${key}::${variables[key]}`)
    }
}

const resolveVariablesInValues = (variables: Dictionary<string>) => {
    const regex = /\$\([\w\.\-]+\)/g

    let iteration = 1;
    let replaced = true;
    while (iteration <= 10 && replaced) {
        replaced = false;
        for (let key in variables) {
            let value = variables[key];
            const matches = value.match(regex)

            if (matches) {
                for (let match of matches) {
                    let strippedMatch = match.slice(2, -1)
                    if (strippedMatch in variables) {
                        value = value.replace(match, variables[strippedMatch])
                        replaced = true;
                    }
                }
            }
            variables[key] = value
        }
    }
}

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