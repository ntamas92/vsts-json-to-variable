import { mergeVariablesInFiles } from "./src/json2variable";
import { ArgumentParser } from "argparse";


const asyncWrapper = async () => {
    const parser = new ArgumentParser({
        description: "DeploymentConfig merger"
    })

    parser.add_argument('-f', '--files', { nargs: "+", help: "Input files to merge. The merge order is their precedence" });

    let args = parser.parse_args();

    console.log(args.files)

    let result = mergeVariablesInFiles(args.files);

    console.log(result)
}

asyncWrapper()