// Modules to control application life and create native browser window
const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const path = require('path')
const dirTree = require('directory-tree')
const { mergeVariablesInFiles } = require("../../Json2Variable/dist/src/json2variable")


function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })

    ipcMain.on('select-dirs', async (event, arg) => {
        const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })

        try {
            if (result.filePaths.length > 0) {
                event.returnValue = dirTree(result.filePaths[0])
            }
            else {
                console.log('no dir selected')
                event.returnValue = undefined
            }    
        }
        catch(error){
            console.log(error)
            event.returnValue = undefined
        }
    })


    ipcMain.on('merge-json-files', async (e, args) => {
        try{
            await mergeVariablesInFiles(args).then(x => e.returnValue = x)
        }
        catch(error){
            console.log(error)
            e.returnValue = undefined
        }
    })

    // and load the index.html of the app.
    //   mainWindow.loadFile('index.html')
    mainWindow.loadURL("http://localhost:3000")
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.