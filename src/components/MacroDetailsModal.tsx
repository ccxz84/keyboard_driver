import React, { useEffect, useRef, useState } from 'react';
const { ipcRenderer } = window.require('electron');
import ModalComponent from './ModalComponent';
import { KeyEvent } from 'utils/type';
import { interpretKeyPressAndRelease } from '../utils/utils';

interface MacroDetailsModalProps {
  isOpen: boolean;
  filename: string;
  onClose: () => void;
}

interface MacroEventDetail {
  raw: Uint8Array; // 원본 HID 리포트 데이터
  interpreted: string[]; // 해석된 문자열 이벤트들의 배열
  delay: number; // 지연 시간
}

const MacroDetailsModal: React.FC<MacroDetailsModalProps> = ({ isOpen, filename, onClose }) => {
  const [macroEvents, setMacroEvents] = useState<string[]>([]);
  const [macroDetail, setMacroDetail] = useState<Array<MacroEventDetail> | null>(null);
  const [elapsedTimes, setElapsedTimes] = useState<number[]>([]);

  const scrollContainerRef = useRef(null); // 스크롤 컨테이너 ref 추가

  useEffect(() => {
    setMacroEvents([]);
    if (isOpen) {
      ipcRenderer.send('get-macro-detail', filename);
      ipcRenderer.once('get-macro-detail-response', (event, response: Array<KeyEvent>, error) => {
        if (error) {
          console.error('Error getting macro detail:', error);
          return;
        }

        // 총 경과 시간 계산
        const times = response.map((event: any, index: any) => 
          index === 0 ? 0 : (event.delay - response[0].delay) / 1e6
        );

        setElapsedTimes(times);

        const allKeyEvents = response.map(event => convertUint8ArrayToNumberArray(event.data));
        const interpretedEvents = interpretKeyPressAndRelease(allKeyEvents);

        console.log(interpretedEvents);
        console.log(times);

        // 원본 HID 리포트 데이터와 해석된 문자열 이벤트를 결합
        const combinedDetails = response.map((event, index) => {
          return {
            raw: event.data,
            interpreted: interpretedEvents[index] || [],
            delay: event.delay
          };
        });

        setMacroDetail(combinedDetails);
        
      });

      ipcRenderer.send('start-replay-debug', filename);
      ipcRenderer.on('macro-event', (event, macroEvent) => {
        setMacroEvents(prev => [...prev, macroEvent]);
      });
    }

    return () => {
      ipcRenderer.removeAllListeners('macro-event');
    };
  }, [isOpen, filename]);

  useEffect(() => {
    // 스크롤 조정 로직
    if (scrollContainerRef.current && macroEvents.length > 0) {
      const currentEventIndex = macroEvents.length - 1;
      const currentEventElement = scrollContainerRef.current.children[currentEventIndex];
      if (currentEventElement) {
        const containerHeight = scrollContainerRef.current.offsetHeight;
        const elementTop = currentEventElement.offsetTop;
        const elementHeight = currentEventElement.offsetHeight;
        scrollContainerRef.current.scrollTop = elementTop - containerHeight / 2 + elementHeight / 2;
      }
    }
  }, [macroEvents]); // macroEvents 변경 시 스크롤 위치 조정

  const stopReplay = () => {
    ipcRenderer.send('stop-replay');
    onClose();
  };

  function convertUint8ArrayToNumberArray(data: Uint8Array): number[] {
    return Array.from(data);
  }

  return (
    <ModalComponent isOpen={isOpen} errorMessage={""}>
      <div style={{ width: '30rem' }}>
        <div ref={scrollContainerRef} style={{ height: '30rem', overflowY: 'scroll' }}>
          {macroDetail && macroDetail.map((detail, index) => {
            const timeElapsed = elapsedTimes[index];
            const keyActions = detail.interpreted.join(', ');

            const isCurrentEvent = macroEvents.some(macroEvent => macroEvent === `Event at ${detail.delay}ns`);

            const eventStyle = isCurrentEvent 
              ? { color: 'blue', backgroundColor: '#d3d3d3', border: '1px solid black' } 
              : { color: 'black' };

            return (
              <div key={index} style={eventStyle}>
                {`Time: ${timeElapsed.toFixed(3)}ms, Actions: ${keyActions}`}
              </div>
            );
          })}
        </div>
        <button onClick={stopReplay}>매크로 실행 중단</button>
      </div>
      <button onClick={onClose}>닫기</button>
    </ModalComponent>
  );
};

export default MacroDetailsModal;
