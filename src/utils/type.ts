export interface KeyEvent {
  delay: number;
  data: Uint8Array;   // HID 리포트 데이터
}

export interface ComplexReplayType{
  filename: string;
  delayAfter: number;
  repeatCount: number;
}
