import { app, BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { GetMacroDetailRequest, KeyEvent, ListRequest, MacroEvent, ReplayRequest, StartRequest, StopReplayRequest, StopRequest } from './generated/input_service';
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
        : `file://${path.join(__dirname, '../app/dist/index.html')}`;

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

ipcMain.on('start-recording', (event, fileName) => {
    const request = new StartRequest( { filename: fileName } );
    MacroGrpcClient.startRequest(request);
});

ipcMain.on('end-recording', () => {
    const request = new StopRequest();
    MacroGrpcClient.stopRequest(request);
});

ipcMain.on('start-replay-debug', async (event, filename) => {
    const call = MacroGrpcClient.replayMacroDebug(new ReplayRequest({ filename }));

    call.on('data', (macroEvent) => {
      event.sender.send('macro-event', macroEvent.eventDescription);
    });

    call.on('end', () => {
        event.sender.send('replay-ended');
    });

    call.on('error', (error) => {
        event.sender.send('grpc-error', error.message);
    });
});

// IPC handler to stop replaying the macro
ipcMain.on('stop-replay', async (event) => {
    const request = new StopReplayRequest();
    try {
      const response = await MacroGrpcClient.stopReplay(request);
      event.sender.send('replay-stopped', response);
    } catch (error) {
      event.sender.send('grpc-error', error);
    }
  });

// IPC handler to fetch the list of saved macros
ipcMain.on('list-macros', async (event) => {
    const request = new ListRequest();
    MacroGrpcClient.listSaveFiles(request, (error, response) => {
        if (error) {
            event.sender.send('grpc-error', error.message);
            return;
        }
        event.sender.send('macro-list', response!.filenames);
    });
});
  
ipcMain.on('stop-replay', (event) => {
  MacroGrpcClient.stopReplay(new StopReplayRequest()).then((response) => {
    event.sender.send('replay-stopped', response);
  }).catch((error) => {
    event.sender.send('grpc-error', error.message);
  });
});
  
// Electron의 메인 프로세스 (예: electron.ts)

ipcMain.on('get-macro-detail', async (event, filename) => {
  try {
    const response = await MacroGrpcClient.getMacroDetail(new GetMacroDetailRequest({ filename }));
    const events = response.events.map(event => {
      const delay = event.delay;
      const data = event.data;
      return { delay, data };
    });
    event.sender.send('get-macro-detail-response', events, null);
  } catch (error) {
    console.error('Error getting macro detail:', error);
    event.sender.send('get-macro-detail-response', null, error);
  }
});

