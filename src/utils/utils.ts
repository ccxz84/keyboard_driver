export function interpretKeyPressAndRelease(hidReports: number[][]): string[][] {
    const MODIFIER_KEYS: Record<number, string>  = {
        0x01: 'Left Ctrl',
        0x02: 'Left Shift',
        0x04: 'Left Alt',
        0x08: 'Left Win',
        0x10: 'Right Ctrl',
        0x20: 'Right Shift',
        0x40: 'Right Alt',
        0x80: 'Right GUI'
    };

    const HID_KEY_CODES: { [key: string]: number } = {
        'a': 0x04, 'b': 0x05, 'c': 0x06, 'd': 0x07,
        'e': 0x08, 'f': 0x09, 'g': 0x0A, 'h': 0x0B,
        'i': 0x0C, 'j': 0x0D, 'k': 0x0E, 'l': 0x0F,
        'm': 0x10, 'n': 0x11, 'o': 0x12, 'p': 0x13,
        'q': 0x14, 'r': 0x15, 's': 0x16, 't': 0x17,
        'u': 0x18, 'v': 0x19, 'w': 0x1A, 'x': 0x1B,
        'y': 0x1C, 'z': 0x1D,
        '1': 0x1E, '2': 0x1F, '3': 0x20, '4': 0x21,
        '5': 0x22, '6': 0x23, '7': 0x24, '8': 0x25,
        '9': 0x26, '0': 0x27,
        'Space': 0x44,
        'Enter': 0x28, 'Esc': 0x29, 'Backspace': 0x2A, 'Tab': 0x2B, 
        'Minus': 0x2D, 'Equal': 0x2E, 'LeftBracket': 0x2F,
        'RightBracket': 0x30, 'Backslash': 0x31, 'NonUSHash': 0x32, 'Semicolon': 0x33,
        'Quote': 0x34, 'Grave': 0x35, 'Comma': 0x36, 'Period': 0x37,
        'Slash': 0x38, 'CapsLock': 0x39,
        'F1': 0x3A, 'F2': 0x3B, 'F3': 0x3C, 'F4': 0x3D,
        'F5': 0x3E, 'F6': 0x3F, 'F7': 0x40, 'F8': 0x41,
        'F9': 0x42, 'F10': 0x43, 'F11': 0x44, 'F12': 0x45,
        'PrintScreen': 0x46, 'ScrollLock': 0x47, 'Pause': 0x48,
        'Insert': 0x49, 'Home': 0x4A, 'PageUp': 0x4B,
        'Delete': 0x4C, 'End': 0x4D, 'PageDown': 0x4E,
        'Right': 0x4F, 'Left': 0x50, 'Down': 0x51, 'Up': 0x52,
        'NumLock': 0x53, 'KeypadDivide': 0x54, 'KeypadMultiply': 0x55,
        'KeypadMinus': 0x56, 'KeypadPlus': 0x57, 'KeypadEnter': 0x58,
        'Keypad1': 0x59, 'Keypad2': 0x5A, 'Keypad3': 0x5B,
        'Keypad4': 0x5C, 'Keypad5': 0x5D, 'Keypad6': 0x5E,
        'Keypad7': 0x5F, 'Keypad8': 0x60, 'Keypad9': 0x61,
        'Keypad0': 0x62, 'KeypadPeriod': 0x63,
        'NonUSBackslash': 0x64, 'Application': 0x65, 'Power': 0x66,
        'KeypadEqual': 0x67,
        'F13': 0x68, 'F14': 0x69, 'F15': 0x6A, 'F16': 0x6B,
        'F17': 0x6C, 'F18': 0x6D, 'F19': 0x6E, 'F20': 0x6F,
        'F21': 0x70, 'F22': 0x71, 'F23': 0x72, 'F24': 0x73,
        'Execute': 0x74, 'Help': 0x75, 'Menu': 0x76, 'Select': 0x77,
        'Stop': 0x78, 'Again': 0x79, 'Undo': 0x7A, 'Cut': 0x7B,
        'Copy': 0x7C, 'Paste': 0x7D, 'Find': 0x7E, 'Mute': 0x7F,
        'VolumeUp': 0x80, 'VolumeDown': 0x81,
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

    function interpretKeyPressAndRelease(hidReports: number[][]): string[][] {
        let previousKeys = new Set<number>();
        let keyActions: string[][] = [];
        let previousModiKey = 0;

        for (let report of hidReports) {
            let currentModiKey = report[0];
            let keyCodes = report.slice(2); // 첫 번째 두 바이트는 수정자와 예약 바이트
            let currentKeys = new Set(keyCodes.filter(code => code !== 0));

            let pressedKeys = new Set([...currentKeys].filter(x => !previousKeys.has(x)));
            let releasedKeys = new Set([...previousKeys].filter(x => !currentKeys.has(x)));
            let actions: string[] = [];

            // 키 이벤트 추가
            pressedKeys.forEach(code => actions.push(`${interpretHIDReport(code)} 누름`));
            releasedKeys.forEach(code => actions.push(`${interpretHIDReport(code)} 뗌`));

            // 수정자 키 변화 감지
            if (currentModiKey !== previousModiKey) {
                let previousModifiers = interpretModifierByte(previousModiKey);
                let currentModifiers = interpretModifierByte(currentModiKey);

                previousModifiers.filter(mod => !currentModifiers.includes(mod))
                    .forEach(mod => actions.push(`${mod} 뗌`));
                currentModifiers.filter(mod => !previousModifiers.includes(mod))
                    .forEach(mod => actions.push(`${mod} 누름`));
            }

            previousKeys = currentKeys;
            previousModiKey = currentModiKey;
            keyActions.push(actions);
        }

        return keyActions;
    }

    return interpretKeyPressAndRelease(hidReports);
}

