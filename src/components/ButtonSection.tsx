import React from 'react';
import ButtonComponent from './ButtonComponent';
import ModalComponent from './ModalComponent';
import MacroListComponent from './MacroListComponent';
import MacroDetailsModal from './MacroDetailsModal';
import MacroRemoveListComponent from './MacroRemoveListComponent';
import ComplexReplayComponent from './ComplexReplayComponent';
import { ComplexReplayType } from 'utils/type';
const { ipcRenderer } = window.require('electron');

const ButtonSection: React.FC =  () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fileName, setFileName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isMacroListModalOpen, setIsMacroListModalOpen] = React.useState(false);
  const [isMacroRemoveListModalOpen, setIsMacroRemoveListModalOpen] = React.useState(false);
  const [selectedMacroFilename, setSelectedMacroFilename] = React.useState<string | null>(null);
  const [isComplexReplayModalOpen, setIsComplexReplayModalOpen] = React.useState(false);

  const handleStartMacro = () => {
    setIsMacroListModalOpen(true);
  };

  const handleMacroSelected = (filename: string) => {
    setSelectedMacroFilename(filename); // 선택된 매크로 파일 이름 설정
    setIsMacroListModalOpen(false); // 매크로 리스트 모달 닫기
  };
  
  const openModal = () => {
    setModalOpen(true);
  };

  const startRecording = () => {
    if (fileName.trim() === '') {
      setErrorMessage('파일 이름을 입력해주세요.'); // 에러 메시지 설정
      return; // 파일 이름이 없으면 여기서 함수 실행을 멈춥니다.
    }
    // 파일 이름이 있으면 모달을 닫고 녹화를 시작합니다.
    setErrorMessage(''); // 에러 메시지를 지웁니다.
    closeModal();
    ipcRenderer.send('start-recording', fileName);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrorMessage(''); // 모달을 닫을 때 에러 메시지도 초기화합니다.
  };

  const handleRemoveMacro = () => {
    setIsMacroRemoveListModalOpen(true);
  };

  const handleComplexReplay = (isOpen: boolean) => {
    setIsComplexReplayModalOpen(isOpen);
  };

  const handleRemoveMacroSelected = (filename: string[]) => {
    ipcRenderer.send('remove-macro', filename);
  }

  const endRecording = () => {
    ipcRenderer.send('end-recording');
  };

  const startComplexReplay = (complexReplayRequest: ComplexReplayType[], repeatCount: number) => {
    // ipcRenderer.send('start-complex-replay', complexReplayRequest, repeatCount);
    ipcRenderer.send('start-complex-replay-arduino', complexReplayRequest, repeatCount)
  }

  return (
    <div className="button-section">
      <ButtonComponent text="녹화 시작" onClick={openModal} />
      <ModalComponent isOpen={modalOpen} errorMessage={errorMessage}>
        <div>파일 제목 입력</div>
        <input type="text" value={fileName} onChange={(e) => setFileName(e.target.value)} />
        <div className="modal-buttons-container"> {/* 버튼 컨테이너 추가 */}
          <button onClick={closeModal}>취소</button>
          <button onClick={startRecording}>확인</button>
        </div>
      </ModalComponent>
      <ButtonComponent text="녹화 종료" onClick={endRecording} />
      <ButtonComponent text="매크로 시작" onClick={handleStartMacro} />
      {isMacroListModalOpen && (
        <MacroListComponent 
          onMacroSelected={handleMacroSelected} 
          onClose={() => setIsMacroListModalOpen(false)} 
        />
      )}
      {selectedMacroFilename && (
        <MacroDetailsModal 
          isOpen={!!selectedMacroFilename}
          filename={selectedMacroFilename}
          onClose={() => setSelectedMacroFilename(null)}
        />
      )}
      <ButtonComponent text="매크로 삭제" onClick={handleRemoveMacro} />
      {isMacroRemoveListModalOpen && (
        <MacroRemoveListComponent onClose={() => setIsMacroRemoveListModalOpen(false)} onMacroSelected={handleRemoveMacroSelected} />
      )}
      <ButtonComponent text="복잡한 실행"  onClick={() => handleComplexReplay(true)} />
      {isComplexReplayModalOpen && (
        <ComplexReplayComponent onClose={() => handleComplexReplay(false)} runComplexReplay={startComplexReplay} />
      )}
    </div>
  );
};

export default ButtonSection;
