import { app, BrowserWindow, ipcMain, dialog, screen, globalShortcut } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { ComplexReplayRequest, DeleteMacrosRequest, ExportProfileRequest, GetMacroDetailRequest, MouseEvent, KeyboardEvent, GetMacroDetailResponse, ImportProfileRequest, KeyEvent, ListRequest, MacroEvent, ReplayRequest, ReplayTask, StartRequest, StatusResponse, StopReplayRequest, StopRequest } from './generated/input_service';
import GrpcClient from './src/utils/grpc';
import { ComplexReplayType } from './src/utils/type';
import { RestartRequest, UpdateRequest, UpdateResponse } from './generated/restart_service';
import { makeArduinoKeyboardCode } from './src/utils/arduino';
import { exec } from 'node:child_process';
import fs from 'fs';
import { VideoFrame } from './generated/video_service';
import { ClientWritableStream } from '@grpc/grpc-js';

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
    // SerialPort.list().then(ports => {
    //   const arduinoPort = ports.find(port => port.manufacturer && port.manufacturer.includes('Arduino'));
    //   if (arduinoPort) {
    //     resolve(arduinoPort.path);
    //   } else {
    //     reject(new Error('No Arduino found'));
    //   }
    // }).catch(err => reject(new Error('Failed to list serial ports')));
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
    width: 1368,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startURL = isDev
    ? 'http://localhost:1624'
    : `file://${path.join(__dirname, '../app/dist/index.html')}`;

  mainWindow.loadURL(startURL);

    // if (!isDev) {
    //   mainWindow.webContents.once('did-finish-load', () => {
    //     mainWindow?.webContents.executeJavaScript(`
    //             window.history.pushState({}, '', '/');
    //             window.dispatchEvent(new Event('popstate'));
    //         `);
    //     });
    // }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// app.disableHardwareAcceleration();

app.on('ready', () => {
  createWindow();
  startInputListener();

  // 앱 종료 시 전역 단축키 해제
  app.on('will-quit', () => {
    globalShortcut.unregisterAll();
  });
});

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
      // const port = await findArduinoPort();
      // console.log(port);

      const sketchDir = path.join(__dirname, 'stop_sketch');

      if (!fs.existsSync(sketchDir)) {
        fs.mkdirSync(sketchDir);
      }

      // const sketchPath = path.join(__dirname, 'stop_sketch', 'stop_sketch.ino');

      // await saveSketchToFile(code, sketchPath);

      // uploadSketch(port, sketchPath);

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

// function playSound() {
//   const soundPath = path.join(__dirname, 'assets/end.mp3');
//   sound.play(soundPath).catch((err: Error) => {
//     console.error('Error playing sound:', err);
//   });
// }

function showPopupNotification(message: string) {
  // 팝업 창 설정
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const popup = new BrowserWindow({
    width: 300,
    height: 80,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    skipTaskbar: true,
    x: width - 320, // 오른쪽 끝 여백을 두고 창을 배치 (300px 너비 + 20px 여백)
    y: height - 100,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,  // ipcRenderer를 HTML에서 사용하기 위해 필요
      contextIsolation: false, // ipcRenderer 접근 허용
      preload: path.join(__dirname, 'popup-preload.js'), // 필요 시 프리로드 파일 설정
    },
  });

  // HTML 파일 로드
  popup.loadFile('popup.html');

  // 팝업 창에 메시지 전달
  popup.webContents.on('did-finish-load', () => {
    console.log(message)
    popup.webContents.send('show-message', message);
  });

  // 일정 시간 후 창 닫기
  setTimeout(() => {
    if (!popup.isDestroyed()) {
      popup.close();
    }
  }, 3000); // 3초 후 자동 닫힘 (필요 시 조정)
}

let mouseCall: ClientWritableStream<MouseEvent> | null = null;
let keyboardCall: ClientWritableStream<KeyboardEvent> | null = null;
let reconnectingrRemote = false; // 재시도 중인지 여부를 추적

ipcMain.on('start-remote-control', async (event) => {
  connectRemoteControl(event);
});

function connectRemoteControl(event: Electron.IpcMainEvent) {
  if (reconnectingrRemote) return; // 이미 재연결 중이면 중복 실행 방지

  try {
    mouseCall = GrpcClient.MacroGrpcClient.sendRemoteMouseEvents();
    keyboardCall = GrpcClient.MacroGrpcClient.sendRemoteKeyEvents();

    console.log('Remote control streams started.');

    const checkAndRetry = () => {
      if (!isStreamActive(mouseCall) || !isStreamActive(keyboardCall)) {
        if (!reconnectingrRemote) {
          reconnectingrRemote = true; // 재연결 플래그 설정
          console.warn('Stream disconnected. Retrying...');

          // 기존 스트림 종료
          mouseCall?.end();
          keyboardCall?.end();

          // 일정 시간 후 재연결 시도
  setTimeout(() => {
            reconnectingrRemote = false; // 재연결 플래그 해제
            connectRemoteControl(event); // 재연결
          }, 1000); // 1초 후 재연결 시도
        }
      }
    };

    mouseCall.on('end', checkAndRetry);
    mouseCall.on('error', checkAndRetry);

    keyboardCall.on('end', checkAndRetry);
    keyboardCall.on('error', checkAndRetry);

  } catch (error) {
    console.error('Error starting remote control:', error);
  }
}

function isStreamActive(call: ClientWritableStream<any> | null): boolean {
  return !!call && !call.writableEnded; // `writableEnded`가 false면 활성 상태
}

ipcMain.on('mouse-event', (event, mouseEventData) => {
  if (mouseCall) {
    const request: MouseEvent = new MouseEvent(mouseEventData);
    // console.log(request);
    mouseCall.write(request);
  } else {
    console.warn('mouseCall is not initialized');
  }
});

// 키보드 이벤트 수신 및 gRPC 전송
ipcMain.on('keyboard-event', (event, keyboardEventData) => {
  if (keyboardCall) {
    const request: KeyboardEvent = new KeyboardEvent(keyboardEventData);
    keyboardCall.write(request);
        } else {
    console.warn('keyboardCall is not initialized');
  }
});

ipcMain.on('stop-remote-control', () => {
  if (mouseCall) {
    mouseCall.end();
    mouseCall = null;
  }
  if (keyboardCall) {
    keyboardCall.end();
    keyboardCall = null;
  }
});

ipcMain.on('start-complex-replay', async (event, tasks: ComplexReplayType[], repeatCount: number) => {
  try {
    const convertTasks = tasks.map(v => new ReplayTask({ ...v, repeatCount: v.repeatCount || 1 })); // Ensure repeatCount is set
    const call = GrpcClient.MacroGrpcClient.startComplexReplay(new ComplexReplayRequest({ tasks: convertTasks, repeatCount }));

    call.on('data', (response: StatusResponse) => {
      event.sender.send('get-start-complex-replay-response', response, null);
      console.log(response)
      showPopupNotification(response.message);
    });
    call.on('end', () => {
      console.log("Streaming ended");
    });
    call.on('error', (err) => {
      console.error("Error:", err);
    });
  } catch (error) {
    console.error('Error getting macro detail:', error);
    event.sender.send('get-start-complex-replay-response', null, error);
    // playSound();
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
  GrpcClient.VideoGrpcClient.updateAddress(ipAddress);
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

let videoPopup: BrowserWindow | null;

function showVideoPopup() {
  // 팝업 창 설정
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  videoPopup = new BrowserWindow({
    width: 300,
    height: 80,
    frame: true,         // 기본 창 프레임 활성화 (확대/축소 버튼 포함)
    autoHideMenuBar: true,
    resizable: true,     // 크기 조정 가능
    maximizable: true,   // 최대화 가능
    minimizable: true,   // 최소화 가능
    fullscreenable: true, // 전체 화면 전환 가능
    alwaysOnTop: false,  // 일반 창으로 설정
    transparent: false,  // 투명도 비활성화
    skipTaskbar: false,  // 작업 표시줄에 표시
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // HTML 파일 로드
  const startURL = isDev
        ? 'http://localhost:1624#video'
        : `file://${path.join(__dirname, '../app/dist/index.html')}`;

  videoPopup.loadURL(startURL);
  
  videoPopup.on('show', () => console.log("Popup window shown"));
  videoPopup.on('closed', () => {
    videoPopup = null;
    console.log("Popup window closed");
  });

  videoPopup.webContents.openDevTools();

    // 프로덕션 모드에서 '/video'로 이동하도록 설정
  if (!isDev) {
    videoPopup.webContents.once('did-finish-load', () => {
      videoPopup?.webContents.executeJavaScript(`
              window.history.pushState({}, '', '#video');
              window.dispatchEvent(new Event('popstate'));
          `);
      });
  }
}

let isFocused = true; // 포커스 상태 관리

function setupGlobalShortcut() {
  globalShortcut.register('Control+Alt+K', () => {
    if (videoPopup && videoPopup.isFocused()) {
      videoPopup.blur(); // 포커스 해제
      isFocused = false;
      videoPopup.webContents.send('focus-status-changed', isFocused); // 포커스 상태 전송
    }
  });
}

function startInputListener() {
  if (!keyboardCall) {
    keyboardCall = GrpcClient.MacroGrpcClient.sendRemoteKeyEvents();
  }

  let lastHidReport: Uint8Array | null = null; // 마지막 HID 리포트를 저장

  app.on('browser-window-focus', () => {
    console.log("Window focused: Enabling keyboard listener");
    isFocused = true;
    videoPopup?.webContents.send('focus-status-changed', isFocused);

    videoPopup?.webContents.on('before-input-event', (event, input) => {
      if (videoPopup && videoPopup.isFocused()) {
        const { code, control, alt, type } = input;

        // HID 리포트 생성 및 전송
        const hidReport = generateHIDReport(input);
        if (!lastHidReport || !compareReports(hidReport, lastHidReport)) {
          sendKeyboardEvent(hidReport);
          lastHidReport = hidReport;
        }
      }
    });
  });

  app.on('browser-window-blur', () => {
    console.log("Window unfocused: Pausing keyboard listener");
    isFocused = false;
    videoPopup?.webContents.send('focus-status-changed', isFocused); // 포커스 상태 전송
  });
}

ipcMain.on('request-focus-status', (event) => {
  event.reply('focus-status-changed', isFocused);
});

// 앱 초기화 시 단축키 등록
app.whenReady().then(() => {
  setupGlobalShortcut();
});

function mapKeyCodeToHIDKeyCode(code: string): number {
  const HID_KEY_CODES: { [key: string]: number } = {
    'KeyA': 0x04, 'KeyB': 0x05, 'KeyC': 0x06, 'KeyD': 0x07,
    'KeyE': 0x08, 'KeyF': 0x09, 'KeyG': 0x0A, 'KeyH': 0x0B,
    'KeyI': 0x0C, 'KeyJ': 0x0D, 'KeyK': 0x0E, 'KeyL': 0x0F,
    'KeyM': 0x10, 'KeyN': 0x11, 'KeyO': 0x12, 'KeyP': 0x13,
    'KeyQ': 0x14, 'KeyR': 0x15, 'KeyS': 0x16, 'KeyT': 0x17,
    'KeyU': 0x18, 'KeyV': 0x19, 'KeyW': 0x1A, 'KeyX': 0x1B,
    'KeyY': 0x1C, 'KeyZ': 0x1D,
    'Digit1': 0x1E, 'Digit2': 0x1F, 'Digit3': 0x20, 'Digit4': 0x21,
    'Digit5': 0x22, 'Digit6': 0x23, 'Digit7': 0x24, 'Digit8': 0x25,
    'Digit9': 0x26, 'Digit0': 0x27,
    'Enter': 0x28, 'Escape': 0x29, 'Backspace': 0x2A, 'Tab': 0x2B,
    'Space': 0x2C, 'Minus': 0x2D, 'Equal': 0x2E, 'BracketLeft': 0x2F,
    'BracketRight': 0x30, 'Backslash': 0x31, 'Semicolon': 0x33,
    'Quote': 0x34, 'Backquote': 0x35, 'Comma': 0x36, 'Period': 0x37,
    'Slash': 0x38, 'CapsLock': 0x39,
    'F1': 0x3A, 'F2': 0x3B, 'F3': 0x3C, 'F4': 0x3D, 'F5': 0x3E,
    'F6': 0x3F, 'F7': 0x40, 'F8': 0x41, 'F9': 0x42, 'F10': 0x43,
    'F11': 0x44, 'F12': 0x45,
    'Insert': 0x49, 'Home': 0x4A, 'PageUp': 0x4B, 'Delete': 0x4C,
    'End': 0x4D, 'PageDown': 0x4E, 'ArrowRight': 0x4F,
    'ArrowLeft': 0x50, 'ArrowDown': 0x51, 'ArrowUp': 0x52,
    'NumLock': 0x53, 'NumpadDivide': 0x54, 'NumpadMultiply': 0x55,
    'NumpadSubtract': 0x56, 'NumpadAdd': 0x57, 'NumpadEnter': 0x58,
    'Numpad1': 0x59, 'Numpad2': 0x5A, 'Numpad3': 0x5B, 'Numpad4': 0x5C,
    'Numpad5': 0x5D, 'Numpad6': 0x5E, 'Numpad7': 0x5F, 'Numpad8': 0x60,
    'Numpad9': 0x61, 'Numpad0': 0x62, 'NumpadDecimal': 0x63,
    'ContextMenu': 0x65, 'Power': 0x66,
    // 필요 시 추가적인 키 코드를 여기에 추가
  };

  return HID_KEY_CODES[code] || 0x00; // 매핑되지 않은 키는 0x00 반환
}

// HID 리포트를 생성
function generateHIDReport(input: Electron.Input): Uint8Array {
  const { code, control, shift, alt, meta, type } = input;
  const isKeyDown = type === 'keyDown';
  const modifier = (control ? 0x01 : 0) | (shift ? 0x02 : 0) | (alt ? 0x04 : 0) | (meta ? 0x08 : 0);
  const hidKeyCode = mapKeyCodeToHIDKeyCode(code);

  if (isKeyDown) {
    return new Uint8Array([modifier, 0x00, hidKeyCode, 0x00, 0x00, 0x00, 0x00, 0x00]);
  } else {
    // Key release 리포트: 모든 키 값을 0으로 설정
    return new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  }
}

// HID 리포트 비교 함수
function compareReports(report1: Uint8Array, report2: Uint8Array): boolean {
  if (report1.length !== report2.length) return false;
  for (let i = 0; i < report1.length; i++) {
    if (report1[i] !== report2[i]) return false;
  }
  return true;
}

// gRPC를 통해 HID 이벤트 전송
function sendKeyboardEvent(hidReport: Uint8Array) {
  if (keyboardCall) {
    const request: KeyboardEvent = new KeyboardEvent({ data: Buffer.from(hidReport) });
    keyboardCall.write(request);
  } else {
    console.warn('keyboardCall is not initialized');
  }
}

function sendMouseEvent(mouseEventData: any) {
  if (mouseCall) {
    const request: MouseEvent = new MouseEvent(mouseEventData);
    // console.log(request);
    mouseCall.write(request);
  } else {
    console.warn('mouseCall is not initialized');
  }
}

let isRemoteRetrying = false;

ipcMain.on('view-video-stream', async (event) => {
  showVideoPopup();
});

ipcMain.on('connect-video-stream', async (event) => {
  // 비디오 스트리밍을 시작
  startVideoStream(event);
});

ipcMain.on('calcul-minimap-video-stream', async (event) => {
  // 비디오 스트리밍을 시작
  startMinimapVideoStream(event);
});

let isRetrying = false;  // 중복 재시도를 방지하기 위한 플래그

function startMinimapVideoStream(event: Electron.IpcMainEvent) {
  const call = GrpcClient.VideoGrpcClient.streamMinimapVideo();

  call.on('data', (frame: VideoFrame) => {
    event.sender.send('stream-minimap-video-frame', { frame });
  });

  call.on('end', () => {

  });

  call.on('error', () => {

  });
}

function retryMinimapVideoStream(event: Electron.IpcMainEvent) {
  if (isRetrying) return; // 이미 재시도 중이면 실행하지 않음
  isRetrying = true;

  setTimeout(() => {
    console.log('Retrying video stream...');

    // 플래그를 해제하고 스트림을 다시 시작
    isRetrying = false;
    startVideoStream(event);
  }, 5000); // 1초 후 재시도
}

function startVideoStream(event: Electron.IpcMainEvent) {
  // 재시도 중인 경우에는 새로운 스트림을 시작하지 않음
  if (isRetrying) return;

  const call = GrpcClient.VideoGrpcClient.streamVideo();

  call.on('data', (frame: VideoFrame) => {
    if (videoPopup && !videoPopup.isDestroyed()) {
      videoPopup.webContents.send('stream-video-frame', { frame });
    }
  });

  call.on('end', () => {
    // 스트림이 종료된 경우 재시도
    retryVideoStream(event);
  });

  call.on('error', (error) => {
    // 에러 발생 시 재시도
    retryVideoStream(event);
  });
}

function retryVideoStream(event: Electron.IpcMainEvent) {
  if (isRetrying) return; // 이미 재시도 중이면 실행하지 않음
  isRetrying = true;

  setTimeout(() => {
    console.log('Retrying video stream...');

    // videoPopup이 닫혔거나 파괴된 경우 새 창을 생성
    if (!videoPopup || videoPopup.isDestroyed()) {
      showVideoPopup();
    }

    // 플래그를 해제하고 스트림을 다시 시작
    isRetrying = false;
    startVideoStream(event);
  }, 5000); // 1초 후 재시도
}

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

