import { mergeVariablesInFiles } from "./json2variable";
import { WriteFile } from "./getFSData";
import { ArgumentParser } from "argparse";
import { Dictionary } from "./common";


const asyncWrapper = async () => {
    const parser = new ArgumentParser({
        description: "DeploymentConfig merger"
    })

    parser.add_argument('-f', '--files', { nargs: "+", help: "Input files to merge. The merge order is their precedence." });
    parser.add_argument('-o', '--output', { help: "Output file path. If not provided, only console output will be used." })

    let args = parser.parse_args();

    console.log(args.files)

    let result = await mergeVariablesInFiles(args.files);

    printVariables(result)

    if (args.output) {
        await WriteFile(args.output, JSON.stringify(result, null, 2));
    }
}

const printVariables = (variables: Dictionary<string>) => {
    for (let key in variables) {
        console.log(`${key}::${variables[key]}`)
    }
}

asyncWrapper()
