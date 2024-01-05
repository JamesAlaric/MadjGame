import React from 'react';
import "./Box.css";

interface BoxProps {
  value: string | null;
  onClick: () => void;
}

const Box: React.FC<BoxProps> = ({ value, onClick }) => {
  const style = value === "X" ? "box x" : "box o";

  return (
    <button className={style} onClick={onClick}>{value}</button>
  );
}

export default Box;
