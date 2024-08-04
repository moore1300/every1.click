const { ipcRenderer } = require('electron');

// Make the window draggable
ipcRenderer.on('set-draggable', () => {
    const { remote } = require('electron');
    const mainWindow = remote.getCurrentWindow();
    mainWindow.setResizable(false);
    mainWindow.setMovable(true);
});

// Handle exit button click
document.getElementById('exit-button').addEventListener('click', () => {
    const { remote } = require('electron');
    const mainWindow = remote.getCurrentWindow();
    mainWindow.close();
});
