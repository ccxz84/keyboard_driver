import { app, BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { ComplexReplayRequest, DeleteMacrosRequest, GetMacroDetailRequest, GetMacroDetailResponse, KeyEvent, ListRequest, MacroEvent, ReplayRequest, ReplayTask, StartRequest, StopReplayRequest, StopRequest } from './generated/input_service';
import GrpcClient from './src/utils/grpc';
import { ComplexReplayType } from './src/utils/type';
import { RestartRequest } from './generated/restart_service';
import { HidReports, makeArduinoKeyboardCode } from './src/utils/arduino';


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
    GrpcClient.MacroGrpcClient.startRequest(request);
});

ipcMain.on('end-recording', () => {
    const request = new StopRequest();
    GrpcClient.MacroGrpcClient.stopRequest(request);
});

ipcMain.on('remove-macro', (event, filenames) => {
  const request = new DeleteMacrosRequest( { filenames } );
 GrpcClient.MacroGrpcClient.deleteMacros(request);
});

ipcMain.on('start-replay-debug', async (event, filename) => {
    const call = GrpcClient.MacroGrpcClient.replayMacroDebug(new ReplayRequest({ filename }));

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
      const response = await GrpcClient.MacroGrpcClient.stopReplay(request);
      event.sender.send('replay-stopped', response);
    } catch (error) {
      event.sender.send('grpc-error', error);
    }
  });

// IPC handler to fetch the list of saved macros
ipcMain.on('list-macros', async (event) => {
    const request = new ListRequest();
    GrpcClient.MacroGrpcClient.listSaveFiles(request, (error, response) => {
        if (error) {
            event.sender.send('grpc-error', error.message);
            return;
        }
        event.sender.send('macro-list', response!.filenames);
    });
});
  
// Electron의 메인 프로세스 (예: electron.ts)

ipcMain.on('get-macro-detail', async (event, filename) => {
  try {
    const response = await GrpcClient.MacroGrpcClient.getMacroDetail(new GetMacroDetailRequest({ filename }));
    const events = converMessage(response);
    event.sender.send('get-macro-detail-response', events, null);
  } catch (error) {
    console.error('Error getting macro detail:', error);
    event.sender.send('get-macro-detail-response', null, error);
  }
});

function converMessage(response: GetMacroDetailResponse) {
  const events = response.events.map(event => {
    const delay = event.delay;
    const data = event.data;
    return { delay, data };
  });

  return events;
}

ipcMain.on('start-complex-replay', async (event, tasks: ComplexReplayType[], repeatCount: number) => {
  try {
    const convertTasks = tasks.map(v => new ReplayTask(v));
    const response = await GrpcClient.MacroGrpcClient.startComplexReplay(new ComplexReplayRequest({ tasks: convertTasks, repeatCount}));
    event.sender.send('get-start-complex-replay-response', response, null);
  } catch (error) {
    console.error('Error getting macro detail:', error);
    event.sender.send('get-start-complex-replay-response', null, error);
  }
});

ipcMain.on('start-complex-replay-arduino', async (event, tasks: ComplexReplayType[], repeatCount: number) => {
  function convertUint8ArrayToNumberArray(data: Uint8Array): number[] {
    return Array.from(data);
  }
  try {
    // const convertTasks = tasks.map(v => new ReplayTask(v));
    // const response = await GrpcClient.MacroGrpcClient.startComplexReplay(new ComplexReplayRequest({ tasks: convertTasks, repeatCount}));
    // event.sender.send('get-start-complex-replay-response', response, null);

    // const hidReports: HidReports[] = [];

    // tasks.forEach(async value => {
    //   const response = await GrpcClient.MacroGrpcClient.getMacroDetail(new GetMacroDetailRequest({ filename: value.filename }));

    //   const events = converMessage(response);

    //   const allKeyEvents = events.map(event => convertUint8ArrayToNumberArray(event.data));
    //   const allDelay = events.map(event => event.delay);

    //   const hidReport: HidReports = { hidReports: allKeyEvents, runTime: allDelay, delayAfter: value.delayAfter};
      
    //   hidReports.push(hidReport);
    // });

    // const code = makeArduinoKeyboardCode(hidReports, repeatCount);

    // console.log(code);

    const promises = tasks.map(async (value) => {
      const response = await GrpcClient.MacroGrpcClient.getMacroDetail(new GetMacroDetailRequest({ filename: value.filename }));
      const events = converMessage(response);
      const allKeyEvents = events.map(event => convertUint8ArrayToNumberArray(event.data));
      const allDelay = events.map(event => event.delay);
      return {
        hidReports: allKeyEvents,
        runTime: allDelay,
        delayAfter: value.delayAfter
      };
    });

    const hidReports = await Promise.all(promises); // 모든 비동기 작업이 완료될 때까지 기다립니다.
    const code = makeArduinoKeyboardCode(hidReports, repeatCount);
    console.log(code);
  } catch (error) {
    console.error('Error getting macro detail:', error);
    event.sender.send('get-start-complex-replay-response', null, error);
  }
});

ipcMain.on('change-ip-address', async (event, ipAddress: string) => {
  GrpcClient.MacroGrpcClient.updateAddress(ipAddress);
  GrpcClient.RestartGrpcClient.updateAddress(ipAddress);
});

ipcMain.on('restart-driver', async (event) => {
  const request = new RestartRequest();
  GrpcClient.RestartGrpcClient.restartRequest(request);
});
