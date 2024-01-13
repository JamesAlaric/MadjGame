

import React from "react";
import "./input.css"

interface InputProps {
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({ value, onChange }) => {
  return (
    <div className="board-size-input">
      <input
        id="board-size"
        type="number"
        value={value}
        onChange={onChange}
        placeholder="taille du plateau"
      />
    </div>
  );
};

export default Input;
