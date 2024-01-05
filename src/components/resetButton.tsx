import React from 'react';
import "./resetButton.css";

interface ResetButtonProps {
  resetBoard: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ resetBoard }) => {
  return (
    <button className="reset-btn" onClick={resetBoard}>Reset</button>
  );
}

export default ResetButton;
