import React from 'react';
import './style/App.scss';
import FileFolderSection from './components/FileFolderSection';
import DropdownSection from './components/DropdownSection';
import ButtonSection from './components/ButtonSection';
import SearchSection from './components/SearchSection';

const App: React.FC = () => {
  return (
    <div className="App">
      <FileFolderSection />
      <DropdownSection />
      <ButtonSection />
      <SearchSection />
    </div>
  );
}

export default App; 
