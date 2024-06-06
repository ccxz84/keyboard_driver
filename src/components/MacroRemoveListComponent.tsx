import React, { useEffect, useState } from 'react';
import ModalComponent from './ModalComponent';
import Hangul from 'hangul-js';
const { ipcRenderer } = window.require('electron');

interface MacroListComponentProps {
  onClose: () => void;
  onMacroSelected: (filename: string[]) => void; 
}

const MacroListComponent: React.FC<MacroListComponentProps> = ({ onClose, onMacroSelected }) => {
  const [macros, setMacros] = useState<string[]>([]);
  const [selectedMacros, setSelectedMacros] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    ipcRenderer.send('list-macros');
    
    const handleMacroListResponse = (event: any, receivedMacros: string[]) => {
      const sortedMacros = receivedMacros.sort();
      setMacros(sortedMacros);
    };

    ipcRenderer.on('macro-list', handleMacroListResponse);

    return () => {
      ipcRenderer.removeListener('macro-list', handleMacroListResponse);
    };
  }, []);

  const handleMacroClick = (filename: string) => {
    if (selectedMacros.includes(filename)) {
      setSelectedMacros(selectedMacros.filter(macro => macro !== filename)); // 선택 취소
    } else {
      setSelectedMacros([...selectedMacros, filename]); // 선택 추가
    }
  };

  const handleConfirmClick = () => {
    console.log(`Selected macros: ${selectedMacros.join(', ')} start`);
    onMacroSelected(selectedMacros);
    onClose(); // 확정 버튼을 누른 후에 모달을 닫음
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredMacros = macros.filter(macro => 
    Hangul.search(macro, searchTerm) !== -1
  );

  return (
    <ModalComponent isOpen={true} errorMessage={""}>
      <div>
        <input 
          type="text" 
          placeholder="Search macros..." 
          value={searchTerm} 
          onChange={handleSearchChange}
          style={{ marginBottom: '10px', padding: '5px', width: '100%' }}
        />
      </div>
      <div style={{ border: '1px solid', overflow: "auto", height: "150px" }}>
        {filteredMacros.map((filename) => (
          <div 
            style={{ 
              padding: '2px', 
              border: '1px solid', 
              backgroundColor: selectedMacros.includes(filename) ? '#add8e6' : 'transparent'
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
