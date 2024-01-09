import React, { useEffect, useCallback, useMemo } from "react";
import Box from "./Box";
import "./Board.css";

interface BoardProps {
  size:number;
  onSizeChange: (size: number) => void;
  board: string[][];
  onBoxClick: (i: number, j: number) => void;
}

const Board: React.FC<BoardProps> =({ size, onSizeChange, board, onBoxClick }) => {

  useEffect(() => {
    if (size > 0) {
      document.documentElement.style.setProperty('--size', size.toString());
    }
  }, [size]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSizeStr = e.target.value;
    const newSize = newSizeStr === '' ? 0 : parseInt(newSizeStr, 10);
    if (!isNaN(newSize) && newSize >= 0) {
      onSizeChange(newSize);
    }
  }, [ onSizeChange]);

  const boxes = useMemo(() => (
    board.flatMap((row, i) =>
      row.map((cell, j) => (
        <Box
          key={`${i}-${j}`}
          value={cell || null}
          onClick={() => onBoxClick(i, j)}
        />
      ))
    )
  ), [board, onBoxClick]);

  return (
    <>
      <div className="board-size-input">
        <input
          id="board-size"
          type="number"
          value={size || ''}
          onChange={handleInputChange}
          placeholder="taille du plateau"
        />
      </div>
      <div className="board">{boxes}</div>
    </>
  );
};

export default Board;
