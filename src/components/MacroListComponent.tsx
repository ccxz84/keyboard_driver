// MacroListComponent.tsx
import React, { useEffect, useState } from 'react';
import ModalComponent from './ModalComponent';
const { ipcRenderer } = window.require('electron');

interface MacroListComponentProps {
  onClose: () => void;
  onMacroSelected: (filename: string) => void; // 이 부분을 추가합니다.
}

const MacroListComponent: React.FC<MacroListComponentProps> = ({ onClose, onMacroSelected }) => {
  const [macros, setMacros] = useState<string[]>([]);
  const [selectedMacro, setSelectedMacro] = useState<string | null>(null); // 추가된 state

  useEffect(() => {
    ipcRenderer.send('list-macros');
    
    const handleMacroListResponse = (event: any, receivedMacros: string[]) => {
      setMacros(receivedMacros);
    };

    ipcRenderer.on('macro-list', handleMacroListResponse);

    return () => {
      ipcRenderer.removeListener('macro-list', handleMacroListResponse);
    };
  }, []);

  const handleMacroClick = (filename: string) => {
    setSelectedMacro(filename); // 선택된 macro를 저장
  };

  const handleConfirmClick = () => {
    if (selectedMacro) {
      console.log(`${selectedMacro} start`);
      onMacroSelected(selectedMacro);
    }
    onClose(); // 확정 버튼을 누른 후에 모달을 닫음
  };

  return (
    <ModalComponent isOpen={true} errorMessage={""}>
      <div style={{ border: '1px solid', overflow: "auto", height: "150px" }}>
        {macros.map((filename) => (
          <div 
            style={{ 
              padding: '2px', 
              border: '1px solid', 
              backgroundColor: filename === selectedMacro ? '#add8e6' : 'transparent' // 하이라이트 조건 추가
            }} 
            key={filename} 
            onClick={() => handleMacroClick(filename)}
          >
            {filename}
          </div>
        ))}
      </div>
      <div className="modal-buttons-container">
        <button onClick={onClose}>취소</button>
        <button onClick={handleConfirmClick}>실행</button>
      </div>
    </ModalComponent>
  );
};

export default React.memo(MacroListComponent);
