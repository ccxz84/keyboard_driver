interface KeyEvent {
    key: string;
    isPress: boolean;
};

export function getArduinoKeyCodeList(hidReports: number[][]): KeyEvent[][] {
    const MODIFIER_KEYS: Record<number, string>  = {
        0x01: 'KEY_LEFT_CTRL',
        0x02: 'KEY_LEFT_SHIFT',
        0x04: 'KEY_LEFT_ALT',
        0x08: 'KEY_LEFT_GUI',
        0x10: 'KEY_RIGHT_CTRL',
        0x20: 'KEY_RIGHT_SHIFT',
        0x40: 'KEY_RIGHT_ALT',
        0x80: 'KEY_RIGHT_GUI'
    };

    const HID_KEY_CODES: { [key: string]: number } = {
        '\'a\'': 0x04, '\'b\'': 0x05, '\'c\'': 0x06, '\'d\'': 0x07,
        '\'e\'': 0x08, '\'f\'': 0x09, '\'g\'': 0x0A, '\'h\'': 0x0B,
        '\'i\'': 0x0C, '\'j\'': 0x0D, '\'k\'': 0x0E, '\'l\'': 0x0F,
        '\'m\'': 0x10, '\'n\'': 0x11, '\'o\'': 0x12, '\'p\'': 0x13,
        '\'q\'': 0x14, '\'r\'': 0x15, '\'s\'': 0x16, '\'t\'': 0x17,
        '\'u\'': 0x18, '\'v\'': 0x19, '\'w\'': 0x1A, '\'x\'': 0x1B,
        '\'y\'': 0x1C, '\'z\'': 0x1D,
        '\'1\'': 0x1E, '\'2\'': 0x1F, '\'3\'': 0x20, '\'4\'': 0x21,
        '\'5\'': 0x22, '\'6\'': 0x23, '\'7\'': 0x24, '\'8\'': 0x25,
        '\'9\'': 0x26, '\'0\'': 0x27,
        ' ': 0x44,
        'KEY_RETURN': 0x28, 'KEY_ESC': 0x29, 'KEY_BACKSPACE': 0x2A, 'KEY_TAB': 0x2B, 
        '\'-\'': 0x2D, '\'=\'': 0x2E, '\'[\'': 0x2F,
        '\']\'': 0x30, '\'\\\\\'': 0x31, '\';\'': 0x33,
        '\'\'\'': 0x34, '\'`\'': 0x35, '\',\'': 0x36, '\'.\'': 0x37,
        'Slash': 0x38, 'KEY_CAPS_LOCK': 0x39,
        'KEY_F1': 0x3A, 'KEY_F2': 0x3B, 'KEY_F3': 0x3C, 'KEY_F4': 0x3D,
        'KEY_F5': 0x3E, 'KEY_F6': 0x3F, 'KEY_F7': 0x40, 'KEY_F8': 0x41,
        'KEY_F9': 0x42, 'KEY_F10': 0x43, 'KEY_F11': 0x44, 'KEY_F12': 0x45,
        'KEY_PRNT_SCRN': 0x46, 'KEY_SCROLL_LOCK': 0x47, 'KEY_PAUSE': 0x48,
        'KEY_INSERT': 0x49, 'KEY_HOME': 0x4A, 'KEY_PAGE_UP': 0x4B,
        'KEY_DELETE': 0x4C, 'KEY_END': 0x4D, 'KEY_PAGE_DOWN': 0x4E,
        'KEY_RIGHT_ARROW': 0x4F, 'KEY_LEFT_ARROW': 0x50, 'KEY_DOWN_ARROW': 0x51, 'KEY_UP_ARROW': 0x52,
        'KEY_NUM_LOCK': 0x53, 'KEY_KP_SLASH': 0x54, 'KEY_KP_ASTERISK': 0x55,
        'KEY_KP_MINUS': 0x56, 'KEY_KP_PLUS': 0x57, 'KEY_KP_ENTER': 0x58,
        'KEY_KP_1': 0x59, 'KEY_KP_2': 0x5A, 'KEY_KP_3': 0x5B,
        'KEY_KP_4': 0x5C, 'KEY_KP_5': 0x5D, 'KEY_KP_6': 0x5E,
        'KEY_KP_7': 0x5F, 'KEY_KP_8': 0x60, 'KEY_KP_9': 0x61,
        'KEY_KP_0': 0x62, 'KEY_KP_DOT': 0x63,
        'KEY_MENU': 0x65,
        // 추가적인 키가 필요한 경우 여기에 추가
    };
    
    // HID 코드를 키 이름으로 역매핑
    const KEY_NAMES: { [code: number]: string } = {};
    for (let key in HID_KEY_CODES) {
        KEY_NAMES[HID_KEY_CODES[key]] = key;
    }
    
    // HID 코드를 키 이름으로 변환하는 함수
    function interpretHIDReport(hidCode: number): string {
        return KEY_NAMES[hidCode] || "Unknown key";
    }

    function interpretModifierByte(modifierByte: number): string[] {
        let activeModifiers: string[] = [];
        for (let modifier in MODIFIER_KEYS) {
            let mask = parseInt(modifier);
            if (modifierByte & mask) {
                activeModifiers.push(MODIFIER_KEYS[modifier]);
            }
        }
        return activeModifiers;
    }

    function interpretKeyPressAndRelease(hidReports: number[][]): KeyEvent[][] {
        let previousKeys = new Set<number>();
        let keyActions: KeyEvent[][] = [];
        let previousModiKey = 0;

        for (let report of hidReports) {
            let currentModiKey = report[0];
            let keyCodes = report.slice(2); // 첫 번째 두 바이트는 수정자와 예약 바이트
            let currentKeys = new Set(keyCodes.filter(code => code !== 0));

            let pressedKeys = new Set([...currentKeys].filter(x => !previousKeys.has(x)));
            let releasedKeys = new Set([...previousKeys].filter(x => !currentKeys.has(x)));
            let actions: KeyEvent[] = [];

            // 키 이벤트 추가
            pressedKeys.forEach(code => actions.push({key: `${interpretHIDReport(code)}`, isPress: true}));
            releasedKeys.forEach(code => actions.push({key: `${interpretHIDReport(code)}`, isPress: false }));

            // 수정자 키 변화 감지
            if (currentModiKey !== previousModiKey) {
                let previousModifiers = interpretModifierByte(previousModiKey);
                let currentModifiers = interpretModifierByte(currentModiKey);

                previousModifiers.filter(mod => !currentModifiers.includes(mod))
                    .forEach(mod => actions.push({key: `${mod}`, isPress: true}));
                currentModifiers.filter(mod => !previousModifiers.includes(mod))
                    .forEach(mod => actions.push({key: `${mod}`, isPress: false}));
            }

            previousKeys = currentKeys;
            previousModiKey = currentModiKey;
            keyActions.push(actions);
        }

        return keyActions;
    }

    return interpretKeyPressAndRelease(hidReports);
}

export interface HidReports {
    hidReports: number[][]; // hid report 리스트
    runTime: number[];      // 시작 시간 기준으로 몇 초에 hid report를 수행하는지
    delayAfter: number;     // 모든 hid report 수행 후 몇 초를 대기할 것인지
};

export function makeArduinoKeyboardCode(hidReports: HidReports[], loop: number): string {

    let code = `
    #include <Keyboard.h>

    void setup() {
        Keyboard.begin();
        Serial.begin(9540);
        randomSeed(analogRead(0));
        delay(1000); // 초기 지연 시간

        for (int i = 0; i < ${loop}; ++i) {
    `;

    hidReports.forEach((report, index) => {
        let prevTime = 0;
        const changeKeyCodes: KeyEvent[][] = getArduinoKeyCodeList(report.hidReports);
        const runTime = report.runTime;

        console.log(changeKeyCodes);

        changeKeyCodes.forEach((keyCode, index) => {
            const diffTime = Math.floor(runTime[index] - prevTime);
            // const diffTime = Math.floor(runTime[index] - prevTime);

            if (diffTime > 0) {
                code += `  delay(random(${(Math.floor(diffTime / 1000000)-10) > 0 ? (Math.floor(diffTime / 1000000)-10) : 0}, ${Math.floor(diffTime / 1000000)+10}));\n`
                // code += `  delay(${diffTime / 1000000});\n`
            }

            keyCode.forEach(value => {
                if (value.isPress) {
                    code += `   Keyboard.press(${value.key});`;
                } else {
                    code += `   Keyboard.release(${value.key});`
                }
                
            });
            prevTime = runTime[index];
        })

        code += `  delay(${report.delayAfter}); // 리포트 후 대기 시간\n`;
    });

    code += 
    `   }
    }
    void loop() {}
    `

    // 최종 생성된 코드 반환
    return code;
}