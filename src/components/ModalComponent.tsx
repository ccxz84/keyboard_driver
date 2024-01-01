import React from 'react';

interface SimpleModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  errorMessage: string;
}

const ModalComponent: React.FC<SimpleModalProps> = ({ isOpen, children, errorMessage }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {children}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default ModalComponent;
