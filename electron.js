const { app, BrowserWindow, ipcMain} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const HID = require('node-hid');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const startURL = isDev
        ? 'http://localhost:8080'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});

ipcMain.on('start-recording', (event) => {
    const devices = HID.devices();
    const targetDevice = devices.filter(device => device.vendorId === 0x1d6b && device.productId === 0x0104);
    console.log(targetDevice);
    
    if (targetDevice[1] && targetDevice[1].path) {
        const device = new HID.HID(targetDevice[1].path);
        device.write([0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]); // HID 장치로 데이터 전송
    } else {
        console.error("장치 또는 경로를 찾을 수 없습니다.");
    }
});

ipcMain.on('end-recording', (event) => {
    const devices = HID.devices();
    const targetDevice = devices.filter(device => device.vendorId === 0x1d6b && device.productId === 0x0104);
    console.log(targetDevice);
    
    if (targetDevice[1] && targetDevice[1].path) {
        const device = new HID.HID(targetDevice[1].path);
        device.write([0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]); // HID 장치로 데이터 전송
    } else {
        console.error("장치 또는 경로를 찾을 수 없습니다.");
    }
});

