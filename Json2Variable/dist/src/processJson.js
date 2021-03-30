"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dataItem = require("./dataitem");
//Function to process through the keys in the JSON.. This will run recursivly through a queue
async function ProcessKeys(jsonData, prefix, shouldPrefix) {
    var dataQueue = [];
    if (!shouldPrefix) {
        prefix = "";
    }
    dataQueue.push(new dataItem.DataItem(jsonData, prefix));
    return new Promise(async (resolve, reject) => {
        let variables = {};
        //Recurse through using the queue
        while (dataQueue.length > 0) {
            //pop the first item off the queue
            var thisDataItem = dataQueue.pop();
            if (thisDataItem != undefined) {
                if (thisDataItem.DataObj != undefined) {
                    try {
                        var thisJson = thisDataItem.DataObj;
                        let result = await ProcessSingleNode(dataQueue, thisJson, thisDataItem, shouldPrefix);
                        if (result) {
                            let [key, val] = result;
                            variables[key] = val;
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            }
        }
        resolve(variables);
    });
}
exports.ProcessKeys = ProcessKeys;
//Process a single Json node
async function ProcessSingleNode(dataQueue, thisJson, thisDataItem, shouldPrefix) {
    if (thisJson != undefined) {
        //If this is not a simple value, but a complex JSON object or an array, we need to push it
        //on to the queue to be processed
        var isArray = await processArrayNode(dataQueue, thisJson, thisDataItem, shouldPrefix);
        var isComplexObject = false;
        if (!isArray) {
            isComplexObject = await processComplexObject(dataQueue, thisJson, thisDataItem, shouldPrefix);
        }
        //Else if this is not a simple value but an array, we need to push each item on to the 
        //queue to be processed            
        if (!(isArray || isComplexObject)) {
            var vName = thisDataItem.PrefixChain;
            // console.log(`${vName}::${thisJson.toString()}`);
            let value = "";
            if (thisJson) {
                value = thisJson.toString();
            }
            return [vName, value];
        }
    }
    return undefined;
}
//Checks if the current JSON Node is an Array, and will loop through and process that array.  Pushing objects on the queue to be recursed through
async function processArrayNode(dataQueue, thisJson, thisDataItem, shouldPrefix) {
    return new Promise(async (resolve, reject) => {
        try {
            var isArray = await isNodeArray(thisJson);
            if (isArray) {
                for (var arrayNDX = 0; arrayNDX < thisJson.length; arrayNDX++) {
                    var prfx = "";
                    prfx = thisDataItem.PrefixChain + (arrayNDX + 1).toString();
                    dataQueue.push(new dataItem.DataItem(thisJson[arrayNDX], prfx));
                }
            }
            resolve(isArray);
        }
        catch (err) {
            reject(err);
        }
    });
}
//Checks to see if the current JSON Node is a complex JSON Object (not a simple string, bool, or number) and will go through each key in the object and push items
//on to the Queue to be recursed through
async function processComplexObject(dataQueue, thisJson, thisDataItem, shouldPrefix) {
    return new Promise(async (resolve, reject) => {
        try {
            var isComplexObject = await isNodeComplex(thisJson);
            if (isComplexObject) {
                for (var key in thisJson) {
                    if (thisJson.hasOwnProperty(key)) {
                        var subObj = thisJson[key];
                        var prfx;
                        if (shouldPrefix || thisDataItem.PrefixChain.length > 0) {
                            prfx = thisDataItem.PrefixChain + "." + key;
                        }
                        else {
                            prfx = key;
                        }
                        dataQueue.push(new dataItem.DataItem(subObj, prfx));
                    }
                }
            }
            resolve(isComplexObject);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.processComplexObject = processComplexObject;
//Tests to see if this item's string indicates it is an array
async function isNodeArray(thisJSONObj) {
    return new Promise(async (resolve, reject) => {
        try {
            var isComplex = false;
            if (thisJSONObj instanceof Array) {
                isComplex = true;
            }
            resolve(isComplex);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.isNodeArray = isNodeArray;
//Tests to see if this items text indicates that it is a complex object
async function isNodeComplex(thisJSONObj) {
    return new Promise(async (resolve, reject) => {
        var typeArray = ["string", "number", "boolean"];
        try {
            var isComplex = false;
            if (typeArray.indexOf(typeof thisJSONObj) > -1) {
                isComplex = false;
            }
            else {
                isComplex = true;
            }
            resolve(isComplex);
        }
        catch (err) {
            reject(err);
        }
    });
}
exports.isNodeComplex = isNodeComplex;
//# sourceMappingURL=processJson.js.map