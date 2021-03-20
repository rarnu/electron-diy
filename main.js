const {app, BrowserWindow, Menu, ipcMain, dialog, nativeTheme} = require('electron');
const path = require('path');
const fs = require("fs");
const moment = require("moment");

let window = null;
let USER_HOME = process.env.HOME;
let SPLIT = '/';

function createWindow() {
    Menu.setApplicationMenu(null);
    window = new BrowserWindow({
        width: 1188,  /* 普通 1188, 调试 1800 */
        height: 1086,
        // resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        },

        icon: path.join(__dirname, 'icon.png')
    })
    // 针对 mac 特殊处理
    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, 'icon.png'));
    }
    if (process.platform.startsWith("win")) {
        SPLIT = '\\';
        USER_HOME = process.env.USERPROFILE;
    } else {
        process.env.PATH += ':/usr/local/bin';
    }
    window.loadFile('index.html').then();
    nativeTheme.themeSource = 'light';
    // window.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

ipcMain.on('capture', (event, args) => {
    window.capturePage({x: 20, y: 20, width: 697, height: 1016}).then((img) => {
        let b64 = img.toDataURL();
        const base64Data = b64.replace(/^data:image\/png;base64,/, "");
        dialog.showSaveDialog({
            title: "请选择要保存的文件名",
            buttonLabel: "保存",
            filters: [
                {name: 'PNG 图片文件', extensions: ['png']},
            ],
            defaultPath: `${USER_HOME}${SPLIT}${args.name}.png`
        }).then((result) => {
            if (!result.canceled) {
                fs.writeFile(result.filePath, base64Data, 'base64', function (err) {

                });
            }
        })
    });

});

function captureCard() {
    window.capturePage({x: 20, y: 20, width: 697, height: 1016}).then((img) => {
        let b64 = img.toDataURL();
        const base64Data = b64.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(`${__dirname}/example.png`, base64Data, 'base64', function (err) {
            console.log(err);
        });
    });
}
