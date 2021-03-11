const {app, BrowserWindow, ipcMain, shell, Menu} = require('electron')
const fs = require('fs');
const gm = require('gm');
const UUID = require('uuid');
const path = require('path');

let USER_HOME = process.env.HOME;
let SPLIT = '/';

function createWindow() {
    Menu.setApplicationMenu(null);
    const win = new BrowserWindow({
        width: 1186,  /* 普通 1186, 调试 1800 */
        height: 900,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false,
            enableRemoteModule: true
        },
        icon: path.join(__dirname, 'icon.png')
    })
    // 针对 mac 特殊处理
    if (process.platform === 'darwin') {
        app.dock.setIcon(path.join(__dirname, 'icon.png'));
    }
    // 针对 windows 特殊处理
    if (process.platform.startsWith('win')) {
        SPLIT = '\\';
        USER_HOME = process.env.USERPROFILE;
    } else {
        // windows 以外的系统处理，增加环境变量
        process.env.PATH += ':/usr/local/bin';
    }
    win.loadFile('index.html').then();
    // win.openDevTools();
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

ipcMain.on('cropCard', (event, args) => {
    const ext = path.extname(args.source);
    const uid = UUID.v1();
    if (!fs.existsSync(`${USER_HOME}${SPLIT}.ygocrop`)) {
        fs.mkdirSync(`${USER_HOME}${SPLIT}.ygocrop`);
    }
    const filename = `${USER_HOME}${SPLIT}.ygocrop${SPLIT}${uid}${ext}`;
    gm(args.source).crop(args.width, args.height, args.x, args.y).write(filename, (_) => {
        // 剪裁结果存个临时文件，再以二进制读取
        const data = fs.readFileSync(filename, 'binary');
        const buffer = new Buffer(data, 'binary');
        // 转换为 base64 并送回渲染线程
        const bufferB64 = buffer.toString('base64');
        fs.rmSync(filename)
        event.sender.send('cropCard-reply', {filename: filename, imgData: bufferB64});
    });
});

ipcMain.on('openCard', (event, args) => {
    const filename = args.filename;
    const data = JSON.parse(fs.readFileSync(filename, 'utf-8'));
    event.sender.send('openCard-reply', {data: data});
})

ipcMain.on('saveCard', (event, args) => {
    const filename = args.filename;
    const data = JSON.stringify(args.data);
    fs.writeFileSync(filename, data, 'utf-8');
});

ipcMain.on('openURL', (event, args) => {
    shell.openExternal(args.url).then();
});

