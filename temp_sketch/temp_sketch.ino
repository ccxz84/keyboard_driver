
    #include <Keyboard.h>

    void setup() {
        Keyboard.begin();
        Serial.begin(9540);
        randomSeed(analogRead(0));
        delay(1000); // 초기 지연 시간

        for (int i = 0; i < 10; ++i) {
      delay(random(0, 10));
   Keyboard.press(KEY_LEFT_ARROW);  delay(random(78, 98));
   Keyboard.release(KEY_LEFT_ARROW);  delay(random(36, 56));
   Keyboard.press('x');  delay(random(675, 695));
   Keyboard.release('x');  delay(random(740, 760));
   Keyboard.press('c');  delay(random(68, 88));
   Keyboard.release('c');  delay(random(135, 155));
   Keyboard.press('v');  delay(random(90, 110));
   Keyboard.release('v');  delay(random(823, 843));
   Keyboard.press('x');  delay(random(734, 754));
   Keyboard.release('x');  delay(random(1203, 1223));
   Keyboard.press('c');  delay(random(63, 83));
   Keyboard.release('c');  delay(random(142, 162));
   Keyboard.press('v');  delay(random(84, 104));
   Keyboard.release('v');  delay(random(569, 589));
   Keyboard.press('x');  delay(random(900, 920));
   Keyboard.release('x');  delay(random(911, 931));
   Keyboard.press('c');  delay(random(67, 87));
   Keyboard.release('c');  delay(random(62, 82));
   Keyboard.press('v');  delay(random(83, 103));
   Keyboard.release('v');  delay(random(331, 351));
   Keyboard.press('x');  delay(random(1032, 1052));
   Keyboard.release('x');  delay(random(770, 790));
   Keyboard.press(KEY_RIGHT_ARROW);  delay(random(78, 98));
   Keyboard.release(KEY_RIGHT_ARROW);  delay(random(627, 647));
   Keyboard.press('c');  delay(random(56, 76));
   Keyboard.release('c');  delay(random(126, 146));
   Keyboard.press('v');  delay(random(186, 206));
   Keyboard.release('v');  delay(random(1024, 1044));
   Keyboard.press('c');  delay(random(72, 92));
   Keyboard.release('c');  delay(random(156, 176));
   Keyboard.press('v');  delay(random(133, 153));
   Keyboard.release('v');  delay(random(575, 595));
   Keyboard.press('x');  delay(random(912, 932));
   Keyboard.release('x');  delay(random(961, 981));
   Keyboard.press(KEY_RIGHT_ARROW);  delay(random(195, 215));
   Keyboard.release(KEY_RIGHT_ARROW);  delay(random(714, 734));
   Keyboard.press(KEY_UP_ARROW);  delay(random(46, 66));
   Keyboard.release(KEY_UP_ARROW);  delay(random(660, 680));
   Keyboard.press(KEY_LEFT_ARROW);  delay(random(60, 80));
   Keyboard.release(KEY_LEFT_ARROW);  delay(random(727, 747));
   Keyboard.press('c');  delay(random(55, 75));
   Keyboard.release('c');  delay(random(343, 363));
   Keyboard.press('v');  delay(random(78, 98));
   Keyboard.release('v');  delay(random(597, 617));
   Keyboard.press('x');  delay(random(760, 780));
   Keyboard.release('x');  delay(random(553, 573));
   Keyboard.press(KEY_DOWN_ARROW);  delay(random(133, 153));
   Keyboard.press('c');  delay(random(128, 148));
   Keyboard.release('c');  delay(random(0, 18));
   Keyboard.release(KEY_DOWN_ARROW);  delay(random(767, 787));
   Keyboard.press(KEY_RIGHT_ARROW);  delay(random(42, 62));
   Keyboard.release(KEY_RIGHT_ARROW);  delay(random(591, 611));
   Keyboard.press('c');  delay(random(296, 316));
   Keyboard.release('c');  delay(random(213, 233));
   Keyboard.press('x');  delay(random(916, 936));
   Keyboard.release('x');  delay(random(382, 402));
   Keyboard.press(KEY_DOWN_ARROW);  delay(random(607, 627));
   Keyboard.press('c');  delay(random(123, 143));
   Keyboard.release('c');  delay(random(168, 188));
   Keyboard.release(KEY_DOWN_ARROW);  delay(random(986, 1006));
   Keyboard.press('x');  delay(random(1292, 1312));
   Keyboard.release('x');  delay(random(538, 558));
   Keyboard.press(KEY_DOWN_ARROW);  delay(random(302, 322));
   Keyboard.press('c');  delay(random(84, 104));
   Keyboard.release('c');  delay(random(36, 56));
   Keyboard.release(KEY_DOWN_ARROW);  delay(random(391, 411));
   Keyboard.press('x');  delay(random(1311, 1331));
   Keyboard.release('x');  delay(random(447, 467));
   Keyboard.press(KEY_DOWN_ARROW);  delay(random(317, 337));
   Keyboard.press('c');  delay(random(107, 127));
   Keyboard.release('c');  delay(random(74, 94));
   Keyboard.release(KEY_DOWN_ARROW);  delay(random(871, 891));
   Keyboard.press('x');  delay(random(1037, 1057));
   Keyboard.release('x');  delay(random(605, 625));
   Keyboard.press(KEY_DOWN_ARROW);  delay(random(202, 222));
   Keyboard.press('c');  delay(random(128, 148));
   Keyboard.release(KEY_DOWN_ARROW);   Keyboard.release('c');  delay(random(387, 407));
   Keyboard.press('x');  delay(random(1275, 1295));
   Keyboard.release('x');  delay(random(533, 553));
   Keyboard.press(KEY_DOWN_ARROW);  delay(random(287, 307));
   Keyboard.press('c');  delay(random(71, 91));
   Keyboard.release('c');  delay(random(14, 34));
   Keyboard.release(KEY_DOWN_ARROW);  delay(random(594, 614));
   Keyboard.press('x');  delay(random(1330, 1350));
   Keyboard.release('x');  delay(random(289, 309));
   Keyboard.press(KEY_DOWN_ARROW);  delay(random(314, 334));
   Keyboard.press('c');  delay(random(94, 114));
   Keyboard.release('c');  delay(random(87, 107));
   Keyboard.release(KEY_DOWN_ARROW);  delay(random(665, 685));
   Keyboard.press('x');  delay(random(840, 860));
   Keyboard.release('x');  delay(random(825, 845));
   Keyboard.press(KEY_LEFT_ARROW);  delay(random(64, 84));
   Keyboard.release(KEY_LEFT_ARROW);  delay(random(321, 341));
   Keyboard.press('x');  delay(random(894, 914));
   Keyboard.release('x');  delay(random(1321, 1341));
   Keyboard.press(KEY_RIGHT_ARROW);  delay(random(72, 92));
   Keyboard.release(KEY_RIGHT_ARROW);  delay(random(732, 752));
   Keyboard.press('c');  delay(random(77, 97));
   Keyboard.release('c');  delay(random(118, 138));
   Keyboard.press('v');  delay(random(85, 105));
   Keyboard.release('v');  delay(random(360, 380));
   Keyboard.press('x');  delay(random(1368, 1388));
   Keyboard.release('x');  delay(random(525, 545));
   Keyboard.press('c');  delay(random(104, 124));
   Keyboard.release('c');  delay(random(95, 115));
   Keyboard.press('v');  delay(random(106, 126));
   Keyboard.release('v');  delay(random(222, 242));
   Keyboard.press('x');  delay(random(1220, 1240));
   Keyboard.release('x');  delay(random(1184, 1204));
   Keyboard.press(KEY_RIGHT_ARROW);  delay(random(231, 251));
   Keyboard.release(KEY_RIGHT_ARROW);  delay(0); // 리포트 후 대기 시간
   }
    }
    void loop() {}
    