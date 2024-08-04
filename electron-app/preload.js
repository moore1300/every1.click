// preload.js
window.addEventListener('DOMContentLoaded', () => {
    // You can add any custom JS code here if needed
});
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.send('close-app')
});