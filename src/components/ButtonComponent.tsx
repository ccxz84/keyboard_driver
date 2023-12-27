import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const ButtonComponent: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { text, onClick } = props;
  return (
    <button onClick={onClick}>{text}</button>
  );
}

export default ButtonComponent;
