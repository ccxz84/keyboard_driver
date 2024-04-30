
    #include <Keyboard.h>

    void setup() {
        Keyboard.begin();
        Serial.begin(9540);
        delay(1000); // 초기 지연 시간

        for (int i = 0; i < 1; ++i) {
      delay(0.000297);
   Keyboard.press('q');  delay(119.947303);
   Keyboard.release('q');  delay(193.029595);
   Keyboard.press('w');  delay(208.952106);
   Keyboard.release('w');  delay(397.00552);
   Keyboard.press('e');  delay(291.955187);
   Keyboard.release('e');  delay(0); // 리포트 후 대기 시간
   }
    }
    void loop() {}
    