const {ipcRenderer} = require('electron');

window.ipcRenderer = ipcRenderer;
window.rarnu = function () {
    console.log('call from vue');
}