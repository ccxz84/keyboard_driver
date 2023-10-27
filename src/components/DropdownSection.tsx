import React from 'react';

const DropdownSection: React.FC = () => {
  return (
    <div className="dropdown-section">
      <label>콤보박스(종):</label>
      <select>
        <option value="60">60</option>
        <option value="120">120</option>
        // 여기에 필요한 값들 추가
      </select>
      <label>콤보박스(종):</label>
      <select>
        <option value="1">1</option>
        <option value="2">2</option>
        // 여기에 필요한 값들 추가
      </select>
    </div>
  );
}

export default DropdownSection;
