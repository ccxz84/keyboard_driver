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

  return (
    <ModalComponent
      isOpen={true} // 이 컴포넌트는 항상 열려 있음
      errorMessage={""}
    >
      <div>
        {macros.map((filename) => (
          <div key={filename} onClick={() => {
            console.log(`${filename} start`);
            onMacroSelected(filename);
            }}>
            {filename}
          </div>
        ))}
      </div>
      <button onClick={onClose}>확인</button>
    </ModalComponent>
  );
};

export default React.memo(MacroListComponent);
