const {app, BrowserWindow, Menu} = require('electron')
const path = require('path');

function createWindow() {
    Menu.setApplicationMenu(null);
    const win = new BrowserWindow({
        width: 1138,  /* 普通 1138, 调试 1800 */
        height: 1086,
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