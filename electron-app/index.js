const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
let mainWindow;

function createWindow() {
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    const windowWidth = 500;
    const windowHeight = 200;
    mainWindow = new BrowserWindow({
        width: windowWidth,
        height: windowHeight,
        x: screenWidth - windowWidth,
        y: 0,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false,
            webSecurity: true
        }
    });

    mainWindow.loadURL('https://every1.click/two.html');

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.executeJavaScript(`
            // Add a draggable region without visible background
            const draggableRegion = document.createElement('div');
            draggableRegion.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 20px; -webkit-app-region: drag; z-index: 9999; background: transparent; border: none;';
            document.body.appendChild(draggableRegion);
            
            const closeButton = document.createElement('button');
            closeButton.textContent = 'X';
            closeButton.style.cssText = 'position: fixed; top: 10px; right: 10px; width: 30px; height: 30px; -webkit-app-region: no-drag; background: rgba(128, 128, 128, 0.7); color: white; border: none; cursor: pointer; z-index: 10000; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;';
            closeButton.addEventListener('click', () => {
                window.electronAPI.closeApp();
            });
            document.body.appendChild(closeButton);

            // Function to scroll to bottom
            function scrollToBottom() {
                window.scrollTo(0, document.body.scrollHeight - 250);
            }

            // Initial scroll
            scrollToBottom();

            // Set up an interval to scroll every second
            setInterval(scrollToBottom, 1000);

            // Set up a MutationObserver to detect changes in the DOM
            const observer = new MutationObserver((mutations) => {
                scrollToBottom();
            });

            // Start observing the entire document with the configured parameters
            observer.observe(document.body, { childList: true, subtree: true });
        `);
    });

    mainWindow.setAlwaysOnTop(true, 'screen-saver');

    // Implement corner snapping
    let isDragging = false;
    let startDragX, startDragY;

    mainWindow.on('will-move', (event, newBounds) => {
        if (!isDragging) {
            isDragging = true;
            startDragX = newBounds.x;
            startDragY = newBounds.y;
        }
    });

    mainWindow.on('moved', () => {
        const [winX, winY] = mainWindow.getPosition();
        const [winWidth, winHeight] = mainWindow.getSize();
        const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
        let newX = winX;
        let newY = winY;

        // Snap to left or right
        if (winX < screenWidth / 2) {
            newX = 0;
        } else {
            newX = screenWidth - winWidth;
        }

        // Snap to top or bottom
        if (winY < screenHeight / 2) {
            newY = 0;
        } else {
            newY = screenHeight - winHeight;
        }

        if (newX !== winX || newY !== winY) {
            mainWindow.setPosition(newX, newY);
        }

        isDragging = false;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('close-app', () => {
    app.quit();
});
