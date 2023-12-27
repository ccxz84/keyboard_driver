import { app, BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { StartRequest, StopRequest } from './generated/input_service';
import MacroGrpcClient from './src/utils/grpc';


let mainWindow: BrowserWindow | null;

function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const startURL = isDev
        ? 'http://localhost:1624'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    mainWindow.loadURL(startURL);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) createWindow();
});

ipcMain.on('start-recording', () => {
    const request = new StartRequest();
    MacroGrpcClient.startRequest(request);
});

ipcMain.on('end-recording', () => {
    const request = new StopRequest({filename: 'test'});
    MacroGrpcClient.stopRequest(request);
});
