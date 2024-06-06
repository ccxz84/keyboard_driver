import React, { useEffect, useState } from 'react';
import ModalComponent from './ModalComponent';
import Hangul from 'hangul-js';
const { ipcRenderer } = window.require('electron');

interface MacroListComponentProps {
  onClose: () => void;
  onMacroSelected: (filename: string) => void;
}

const MacroListComponent: React.FC<MacroListComponentProps> = ({ onClose, onMacroSelected }) => {
  const [macros, setMacros] = useState<string[]>([]);
  const [selectedMacro, setSelectedMacro] = useState<string | null>(null);
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
    setSelectedMacro(filename);
  };

  const handleConfirmClick = () => {
    if (selectedMacro) {
      console.log(`${selectedMacro} start`);
      onMacroSelected(selectedMacro);
    }
    onClose();
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
              backgroundColor: filename === selectedMacro ? '#add8e6' : 'transparent'
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
