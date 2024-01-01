import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');
import ModalComponent from './ModalComponent';
import { KeyEvent } from 'utils/type';
import { interpretKeyPressAndRelease } from '../utils/utils';

interface MacroDetailsModalProps {
  isOpen: boolean;
  filename: string;
  onClose: () => void;
}

const MacroDetailsModal: React.FC<MacroDetailsModalProps> = ({ isOpen, filename, onClose }) => {
  const [macroEvents, setMacroEvents] = useState<string[]>([]);
  const [macroDetail, setMacroDetail] = useState<Array<KeyEvent> | null>(null);
  const [elapsedTimes, setElapsedTimes] = useState<number[]>([]);

  useEffect(() => {
    setMacroEvents([]);
    if (isOpen) {
      ipcRenderer.send('get-macro-detail', filename);
      ipcRenderer.once('get-macro-detail-response', (event, response, error) => {
        if (error) {
          console.error('Error getting macro detail:', error);
          return;
        }

        // 총 경과 시간 계산
        const times = response.map((event: any, index: any) => 
          index === 0 ? 0 : (event.delay - response[0].delay) / 1e6
        );
        setElapsedTimes(times);
        setMacroDetail(response);
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

  const stopReplay = () => {
    ipcRenderer.send('stop-replay');
    onClose();
  };

  function convertUint8ArrayToNumberArray(data: Uint8Array): number[] {
    return Array.from(data);
  }

  return (
    <ModalComponent isOpen={isOpen} errorMessage={""}>
      <div style={{ width: '200rem' }}>
        {macroDetail && macroDetail.map((event, index) => {
          const timeElapsed = elapsedTimes[index];
          const hidReportArray = convertUint8ArrayToNumberArray(event.data);
          const keyActions = interpretKeyPressAndRelease([hidReportArray]);

          const isCurrentEvent = macroEvents.some(macroEvent => macroEvent === `Event at ${event.delay}ns`);

          return (
            <div key={index} style={{ color: isCurrentEvent ? 'blue' : 'black' }}>
              {`Time: ${timeElapsed.toFixed(3)}ms, Actions: ${keyActions.join(', ')}`}
            </div>
          );
        })}

        <button onClick={stopReplay}>매크로 실행 중단</button>
      </div>
      <button onClick={onClose}>닫기</button>
    </ModalComponent>
  );
};

export default MacroDetailsModal;
