import React, { useEffect, useMemo } from "react";
import Box from "./Box";
import "./Board.css";

interface BoardProps {
  size: number;
  board: string[][];
  onBoxClick: (i: number, j: number) => void;
}

const Board: React.FC<BoardProps> = ({ size, board, onBoxClick }) => {

  useEffect(() => {
    if (size > 0) {
      document.documentElement.style.setProperty("--size", size.toString());
    }
  }, [size]);

  const getCellSizeClass = () => {
    if (size <= 5) {
      return 'large-cells';
    } else if (size <= 8) {
      return 'medium-cells';
    } else {
      return 'small-cells';
    }
  };

  const boxes = useMemo(
    () =>
      board.flatMap((row, i) =>
        row.map((cell, j) => (
          <Box
            key={`${i}-${j}`}
            value={cell || null}
            onClick={() => onBoxClick(i, j)}
          />
        ))
      ),
    [board, onBoxClick]
  );

  return (
    <>
      <div className={`board-container ${getCellSizeClass()}`}>
        <div className={`board ${getCellSizeClass()}`}>{boxes}</div>
      </div>
    </>
  );
};

export default Board;
