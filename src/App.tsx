import React from 'react';
import './style/App.scss';
import ButtonSection from './components/ButtonSection';
import ButtonComponent from './components/ButtonComponent';
import UpdateComponent from './components/UpdateComponent';
const { ipcRenderer } = window.require('electron');

const App: React.FC = () => {
  const [ipAddress, setIpAddress] = React.useState<string>('');
  const [isUpdateOpen, setIsUpdateOpen] = React.useState<boolean>(false);

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
        {isUpdateOpen && (
          <UpdateComponent isOpen={isUpdateOpen} onClose={() => {
            setIsUpdateOpen(false);
          }}>
          </UpdateComponent>
        )}
      </div>
    </div>
  );
}

export default App; 
