import React from 'react';
import './style/App.scss';
import ButtonSection from './components/ButtonSection';
import ButtonComponent from './components/ButtonComponent';
import UpdateComponent from './components/UpdateComponent';
import MacroListComponent from './components/MacroListComponent';
const { ipcRenderer } = window.require('electron');

const App: React.FC = () => {
  const [ipAddress, setIpAddress] = React.useState<string>('');
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);
  const [isMacroListOpen, setIsMacroListOpen] = React.useState<boolean>(false);

  const isValidIpAddress = (ip: string) => {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  };

  const changeIpAddress = () => {
    const ipToSet = isValidIpAddress(ipAddress) ? ipAddress : '10.55.0.1';

    if (ipToSet) {
      ipcRenderer.send('change-ip-address', ipToSet);
      console.log('IP Address changed to:', ipToSet);
    } else {
      console.error('Invalid IP address:', ipAddress);
    }
  };

  const resetDriver = () => {
    ipcRenderer.send('restart-driver');
  }

  const handleImportProfile = () => {
    ipcRenderer.send('import-profile');
  };

  const handleExportProfile = (filename: string) => {
    ipcRenderer.send('export-profile', filename);
  };

  return (
    <div className="App">
      <ButtonSection />
      <div style={{height: "100px"}}></div>
      <div style={{ display: "flex", justifyContent: "space-between"}} className="button-section">
        <div>
          <input style={{ marginRight: "20px" }} value={ipAddress} onChange={(value) => setIpAddress(value.target.value)}></input>
          <ButtonComponent text={"적용"} onClick={changeIpAddress} />
        </div>
        <ButtonComponent text={"리셋"} onClick={resetDriver} />
        <ButtonComponent text={"업데이트"} onClick={() => { setIsUpdateOpen(true) }} />
        <ButtonComponent text={"가져오기"} onClick={handleImportProfile} />
        <ButtonComponent text={"내보내기"} onClick={() => { setIsMacroListOpen(true) }} />
        {isUpdateOpen && (
          <UpdateComponent isOpen={isUpdateOpen} onClose={() => {
            setIsUpdateOpen(false);
          }}>
          </UpdateComponent>
        )}
      </div>
      {isMacroListOpen && (
          <MacroListComponent onClose={() => setIsMacroListOpen(false)} onMacroSelected={handleExportProfile} />
      )}
    </div>
  );
}

export default App; 
