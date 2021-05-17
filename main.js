const {app, BrowserWindow, Menu, ipcMain, dialog, nativeTheme} = require('electron');
const path = require('path');
const fs = require('fs');
const request = require('request');
const md5 = require('md5-node');

let window = null;
let USER_HOME = process.env.HOME;
let SPLIT = '/';

const appid = '20171201000101453';
const secret = 'MLhIYijr23XUvrDMxOwS';

function createWindow() {
    Menu.setApplicationMenu(null);
    window = new BrowserWindow({
        width: 1540,  /* 普通 1540, 调试 2150 */
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
                fs.writeFile(result.filePath, base64Data, 'base64', (err) => {

                });
            }
        })
    });
});

/* 接入百度翻译 */

function getSalt() {
    let salt = "";
    for (let i = 0; i < 10; i++) {
        salt += Math.floor(Math.random() * 10);
    }
    return salt;
}

// 调用翻译接口
ipcMain.on('translate', (event, args) => {
    let q = args.text;
    let salt = getSalt();
    let signStr = `${appid}${q}${salt}${secret}`;
    let sign = md5(signStr);
    request.get({
        url: `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeURI(q)}&from=zh&to=jp&appid=${appid}&salt=${salt}&sign=${sign}`,
        method: 'get'
    }, (err, resp, body) => {
        const ret = JSON.parse(body);
        let texts = [];
        ret.trans_result.forEach((item) => {
            texts.push(item.dst);
        });
        event.sender.send('translate-reply', {texts: texts});
    });

});

// 选择批量导出卡图的路径
ipcMain.on('choose-directory', (event, args) => {
    // choose-directory-reply
    dialog.showOpenDialog({
        title: '选择导出目录',
        properties: ['openDirectory']
    }).then((result) => {
        if (!result.canceled) {
            event.sender.send('choose-directory-reply', {path: result.filePaths[0]});
        } else {
            event.sender.send('choose-directory-reply', {path: ''});
        }
    })
})

function generateCardImageName(baseName) {
    if (!fs.existsSync(baseName + '.png')) return baseName + '.png';
    for (let i = 2; i < 100; i++) {
        if (!fs.existsSync(baseName + '.' + i + '.png')) {
            return baseName + '.' + i + '.png';
        }
    }
    return baseName + '.' + getSalt() + '.png';
}

// 批量导出卡图
ipcMain.on('export-image', (event, args) => {
    const base64Data = args.b64.replace(/^data:image\/png;base64,/, "");
    let count = args.count;
    for (let i = 0; i < count; i++) {
        let fn = args.name;
        fn = fn.replace(/[\\/:*?\"<>|&!#$%\'=~^@;+,.]/g, '');
        let dp = generateCardImageName(args.path + SPLIT + args.id + '_' + fn);
        fs.writeFileSync(dp, base64Data, 'base64');
    }
    // 导完一张后回调，再导下一张，回调时回传卡片ID
    event.sender.send('export-image-reply', {id: args.id});
});
