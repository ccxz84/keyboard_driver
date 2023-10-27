import React from 'react';

const SearchSection: React.FC = () => {
  return (
    <div className="search-section">
      <label>검색 :</label>
      <input type="text" />
      <button>검색</button>
    </div>
  );
}

export default SearchSection;
