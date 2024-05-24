import React, { useState } from 'react';
import ModalComponent from './ModalComponent';
import MacroListComponent from './MacroListComponent';
import ButtonComponent from './ButtonComponent';
import { ComplexReplayType } from '../utils/type';
const { ipcRenderer } = window.require('electron');

interface ComplexReplayComponentProps {
  onClose: () => void;
  runComplexReplay: (complexReplayRequest: ComplexReplayType[], repeatCount: number) => void;
  runComplexReplayArduino: (complexReplayRequest: ComplexReplayType[], repeatCount: number) => void;
}

const ComplexReplayComponent: React.FC<ComplexReplayComponentProps> = ({ onClose, runComplexReplay, runComplexReplayArduino }) => {
  const [complexReplayRequest, setComplexReplayRequest] = useState<ComplexReplayType[]>([]);
  const [modalOpenList, setModalOpenList] = useState<boolean[]>([]);
  const [repeatCount, setRepeatCount] = useState<number>(1);

  // ReplayTask의 filename을 업데이트하는 함수
  const updateFilenameAtIndex = (index: number, filename: string) => {
    const updatedTasks: ComplexReplayType[]= complexReplayRequest.map((task, idx) =>
      idx === index ? {...task, filename} : task
    );
    setComplexReplayRequest(updatedTasks);
  };

  const updateDelayAfterAtIndex = (index: number, delayAfter: number) => {
    const updatedTasks = complexReplayRequest.map((task, idx) =>
      idx === index ? {...task, delayAfter} : task
    );
    setComplexReplayRequest(updatedTasks);
  };

  const updateRepeatCountAtIndex = (index: number, repeatCount: number) => {
    const updatedTasks = complexReplayRequest.map((task, idx) =>
      idx === index ? {...task, repeatCount} : task
    );
    setComplexReplayRequest(updatedTasks);
  };

  // modalOpenList의 특정 인덱스 값을 false로 설정하는 함수
  const handleModalAtIndex = (index: number, _isOpen: boolean) => {
    const updatedOpenList = modalOpenList.map((isOpen, idx) => 
      index === idx ? _isOpen : isOpen
    );
    setModalOpenList(updatedOpenList);
  };

  const removeRow = (index: number) => {
    const updatedReplayRequest = [...complexReplayRequest];
  
    // 주어진 인덱스의 요소를 제거합니다.
    updatedReplayRequest.splice(index, 1);

    // 변경된 배열로 상태를 업데이트합니다.
    setComplexReplayRequest(updatedReplayRequest);
  }

  const addRow = () => {
    const newRow = {filename: '', delayAfter: 0, repeatCount: 1};
    const updatedReplayRequest = [...complexReplayRequest, newRow];

    // 변경된 배열로 상태를 업데이트합니다.
    setComplexReplayRequest(updatedReplayRequest);

    const updatedModalOpenList = [...modalOpenList, true];

    setModalOpenList(updatedModalOpenList);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 입력 필드의 값을 가져와서 repeatCount 상태로 설정합니다.
    const newValue = parseInt(event.target.value);
    setRepeatCount(newValue);
  };

  const closeModal = () => {
    ipcRenderer.send('stop-replay');
    onClose();
  }

  const stopReplay = () => {
    ipcRenderer.send('stop-replay');
    ipcRenderer.send('restart-driver');
  };

  return (
    <ModalComponent isOpen={true} errorMessage="">
      <div style={{display: "flex", flexDirection: "row"}}>
        반복 횟수
        <input type="number" onChange={handleInputChange} />
      </div>
      <table>
        <thead>
          <tr>
            <th>파일 이름</th>
            <th>딜레이</th>
            <th>반복 횟수</th>
            <th>파일 선택</th>
          </tr>
        </thead>
        <tbody>
          {complexReplayRequest.map((task, index) => (
            <tr key={index}>
              <td>
                {task.filename}
              </td>
              <td>
                <input
                  type="number"
                  value={task.delayAfter}
                  onChange={(e) => updateDelayAfterAtIndex(index, parseInt(e.target.value, 10))}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={task.repeatCount}
                  onChange={(e) => updateRepeatCountAtIndex(index, parseInt(e.target.value, 10))}
                />
              </td>
              <td>
                <ButtonComponent text={'파일 선택'} onClick={() => {
                  handleModalAtIndex(index, true);
                }}></ButtonComponent>
                {modalOpenList[index] && (
                  <MacroListComponent 
                    onMacroSelected={(filename: string) => {
                      updateFilenameAtIndex(index, filename);
                    }} 
                    onClose={() => {
                      handleModalAtIndex(index, false);
                    }}
                  />
                )}
              </td>
              <td>
                <ButtonComponent text={'열 삭제'} onClick={() => removeRow(index)}></ButtonComponent>
              </td>
            </tr>
          ))}
          <ButtonComponent text={'열 추가'} onClick={addRow}></ButtonComponent>
        </tbody>
      </table>
      <div className="modal-buttons-container">
        <button onClick={closeModal}>창 끄기</button>
        <button onClick={stopReplay}>드라이버 리셋</button>
        <button onClick={() => {
          runComplexReplay(complexReplayRequest, repeatCount);
        }}>실행</button>
        <button onClick={() => {
          runComplexReplayArduino(complexReplayRequest, repeatCount);
        }}>아두이노 실행</button>
      </div>
    </ModalComponent>
  );
};

export default React.memo(ComplexReplayComponent);
