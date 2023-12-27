import React from 'react';
import ButtonComponent from './ButtonComponent';
// import '../style/ButtonSection.scss';
const { ipcRenderer } = window.require('electron');

const ButtonSection: React.FC = () => {
  const startRecording = () => {
    ipcRenderer.send('start-recording');
  };

  const endRecording = () => {
    ipcRenderer.send('end-recording');
  };

  return (
    <div className="button-section">
      <ButtonComponent text="녹화 시작" onClick={startRecording} />
      <ButtonComponent text="녹화 종료" onClick={endRecording} />
    </div>
  );
};

export default ButtonSection;
