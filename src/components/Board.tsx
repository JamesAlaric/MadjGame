import React from 'react';
import Box  from "./Box";
import "./Board.css";

interface BoardProps {
  board: (string | null)[];
  onClick: (idx: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  return (
    <div className="board">
      {board.map((value, idx) => {
        return <Box value={value} onClick={() => value === null && onClick(idx)} />;
      })}
    </div>
  );
}

export default Board;
