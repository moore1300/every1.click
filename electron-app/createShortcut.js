const path = require('path');
const fs = require('fs');
const shortcut = require('shortcut');

const appPath = path.join(__dirname, 'C:\Users\Dylan\electron-app'); // Path to your Electron executable
const desktopPath = path.join(process.env.HOME || process.env.USERPROFILE, 'Desktop', 'MyElectronApp.lnk');

shortcut.create(desktopPath, appPath, 'My Electron App', '', '', '', '', function(err) {
    if (err) {
        console.error('Error creating shortcut:', err);
    } else {
        console.log('Shortcut created on desktop');
    }
});
