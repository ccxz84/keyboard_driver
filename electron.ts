import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { ComplexReplayRequest, DeleteMacrosRequest, ExportProfileRequest, GetMacroDetailRequest, GetMacroDetailResponse, ImportProfileRequest, KeyEvent, ListRequest, MacroEvent, ReplayRequest, ReplayTask, StartRequest, StopReplayRequest, StopRequest } from './generated/input_service';
import GrpcClient from './src/utils/grpc';
import { ComplexReplayType } from './src/utils/type';
import { RestartRequest, UpdateRequest, UpdateResponse } from './generated/restart_service';
import { makeArduinoKeyboardCode } from './src/utils/arduino';
import { exec } from 'node:child_process';
import { SerialPort } from 'serialport';
import fs from 'fs';

function getStopCode(): string {
  return `
  void setup() {

  }
  void loop() {

  }`
}

function uploadSketch(port: string, sketchPath: string) {
  // Arduino CLI를 사용하여 스케치 컴파일 및 업로드
  const compileCommand = `arduino-cli compile -p ${port} --fqbn arduino:avr:leonardo ${sketchPath}`;
  const runCommand = `arduino-cli upload -p ${port} --fqbn arduino:avr:leonardo ${sketchPath}`;
  
  exec(compileCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to compile sketch:', error);
      return;
    }
    console.log('compile successful:', stdout);
  });

  exec(runCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('Failed to compile sketch:', error);
      return;
    }
    console.log('compile successful:', stdout);
  });
}

function findArduinoPort(): Promise<string> {
  return new Promise((resolve, reject) => {
    SerialPort.list().then(ports => {
      const arduinoPort = ports.find(port => port.manufacturer && port.manufacturer.includes('Arduino'));
      if (arduinoPort) {
        resolve(arduinoPort.path);
      } else {
        reject(new Error('No Arduino found'));
      }
    }).catch(err => reject(new Error('Failed to list serial ports')));
  });
}

function saveSketchToFile(code: string, filePath: string): Promise<void> {

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, code, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}


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
      const code = getStopCode();

      const response = await GrpcClient.MacroGrpcClient.stopReplay(request);
      const port = await findArduinoPort();
      console.log(port);

      const sketchDir = path.join(__dirname, 'stop_sketch');

      if (!fs.existsSync(sketchDir)) {
        fs.mkdirSync(sketchDir);
      }

      const sketchPath = path.join(__dirname, 'stop_sketch', 'stop_sketch.ino');

      await saveSketchToFile(code, sketchPath);

      uploadSketch(port, sketchPath);

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

function convertMessage(response: GetMacroDetailResponse) {
  const events = response.events.map(event => {
    const delay = event.delay;
    const data = event.data;
    return { delay, data };
  });

  return events;
}

ipcMain.on('get-macro-detail', async (event, filename) => {
  try {
    const response = await GrpcClient.MacroGrpcClient.getMacroDetail(new GetMacroDetailRequest({ filename }));
    const events = convertMessage(response);
    event.sender.send('get-macro-detail-response', events, null);
  } catch (error) {
    console.error('Error getting macro detail:', error);
    event.sender.send('get-macro-detail-response', null, error);
  }
});

ipcMain.on('start-complex-replay', async (event, tasks: ComplexReplayType[], repeatCount: number) => {
  try {
    const convertTasks = tasks.map(v => new ReplayTask({ ...v, repeatCount: v.repeatCount || 1 })); // Ensure repeatCount is set
    const response = await GrpcClient.MacroGrpcClient.startComplexReplay(new ComplexReplayRequest({ tasks: convertTasks, repeatCount }));
    event.sender.send('get-start-complex-replay-response', response, null);
  } catch (error) {
    console.error('Error getting macro detail:', error);
    event.sender.send('get-start-complex-replay-response', null, error);
  }
});

ipcMain.on('start-complex-replay-arduino', async (event, tasks:
   ComplexReplayType[], repeatCount: number) => {
  function convertUint8ArrayToNumberArray(data: Uint8Array): number[] {
    return Array.from(data);
  }

  try {
    const promises = tasks.map(async (value) => {
      const response = await GrpcClient.MacroGrpcClient.getMacroDetail(new GetMacroDetailRequest({ filename: value.filename }));
      console.log(response);
      const events = convertMessage(response);
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

    const port = await findArduinoPort();
    console.log(port);

    const sketchDir = path.join(__dirname, 'temp_sketch');

    if (!fs.existsSync(sketchDir)) {
      fs.mkdirSync(sketchDir);
    }

    const sketchPath = path.join(__dirname, 'temp_sketch', 'temp_sketch.ino');

    await saveSketchToFile(code, sketchPath);

    uploadSketch(port, sketchPath);
      

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

ipcMain.on('request-update', async (event) => {
  const call = GrpcClient.RestartGrpcClient.requestUpdate(new UpdateRequest());

  call.on('data', (dataEvent: UpdateResponse) => {
    event.sender.send('update-event', {progress: dataEvent.progress,  statusMessage: dataEvent.status_message});
  });

  call.on('end', () => {
      event.sender.send('update-ended');
  });

  call.on('error', (error) => {
      event.sender.send('update-grpc-error', error.message);
  });
});

ipcMain.on('import-profile', async (event) => {
  if (!mainWindow) {
    throw new Error("Main window is not initialized");
  }

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Sav Files', extensions: ['sav'] }]
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const data = fs.readFileSync(filePath);

    const importRequest = {
      filename: path.basename(filePath),
      savfile: data
    };

    
    const a = new ImportProfileRequest(importRequest);

    console.log("Sending import profile request:", a); // 디버그 로그

    GrpcClient.MacroGrpcClient.importProfile(new ImportProfileRequest(importRequest))
      .then(response => {
        event.sender.send('import-profile-success', response);
      })
      .catch(error => {
        event.sender.send('import-profile-error', error.message);
      });
  }
});

// Export profile handler
ipcMain.on('export-profile', async (event, filename) => {
  if (!mainWindow) {
    throw new Error("Main window is not initialized");
  }

  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
    filters: [{ name: 'Sav Files', extensions: ['sav'] }]
  });

  if (!result.canceled && result.filePath) {
    const exportRequest = { filename };

    GrpcClient.MacroGrpcClient.exportProfile(new ExportProfileRequest(exportRequest))
      .then(response => {
        if (result.filePath) {
          fs.writeFileSync(result.filePath, Buffer.from(response.savfile));
          event.sender.send('export-profile-success', `File saved as ${result.filePath}`);
        }
      })
      .catch(error => {
        event.sender.send('export-profile-error', error.message);
      });
  }
});
