"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gfs = require("graceful-fs");
async function OpenFile(filename) {
    var filecontent = gfs.readFileSync(filename, "utf8");
    return filecontent;
}
exports.OpenFile = OpenFile;
async function WriteFile(filename, fileData) {
    var completeSuccess = false;
    var filecontent = "";
    return new Promise(async (resolve, reject) => {
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
exports.WriteFile = WriteFile;
//# sourceMappingURL=getFSData.js.map