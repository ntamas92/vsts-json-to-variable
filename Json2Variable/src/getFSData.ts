import * as path from 'path';
import * as gfs from 'graceful-fs';

export async function OpenFile(filename: string): Promise<string> {
    var filecontent: string = gfs.readFileSync(filename, "utf8");
    return filecontent
}

export async function WriteFile(filename: string, fileData: any): Promise<any> {
    var completeSuccess: boolean = false;
    var filecontent: string = "";
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            filecontent = gfs.writeFileSync(filename, fileData);
            completeSuccess = true;
            resolve(completeSuccess);
        }
        catch (err) {
            reject(err);
        }

    });
}

