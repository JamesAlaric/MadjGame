import React, { useState } from "react";
import Box from "./Box";
import "./Board.css";

interface BoardProps {
  board: (string | null)[];
  onClick: (idx: number) => void;
}

const Board: React.FC<BoardProps> = ({ board, onClick }) => {
  const [n, setN] = useState(5); // Valeur par défaut de n

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setN(value);
      document.documentElement.style.setProperty("--n", value.toString());
    }
  };

  const clearInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.value = ""; // Efface le contenu de l'entrée lorsque l'utilisateur clique dess
  };

  const renderBoxes = () => {
    const boxes = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const idx = i * n + j;
        boxes.push(
          <Box
            key={idx}
            value={board[idx]}
            onClick={() => board[idx] === null && onClick(idx)}
          />
        );
      }
    }
    return boxes;
  };

  return (
    <>
      <div className="entrer">
        <input
          type="number"
          value={n}
          onChange={handleInputChange}
          onFocus={clearInput}
        />
      </div>
      <div className="board">{renderBoxes()}</div>
    </>
  );
};

export default Board;

// import React from "react";
// import Box from "./Box";
// import { Madj } from "./Madj"; // Assurez-vous que le chemin d'import est correct
// import "./Board.css";

// interface BoardProps {
//   madj: Madj;
//   onMarkPlaced: () => void; // Callback appelé après qu'un marqueur a été placé
// }

// const Board: React.FC<BoardProps> = ({ madj, onMarkPlaced }) => {
//   const renderBoxes = () => {
//     const boxes = [];
//     for (let i = 0; i < madj.size; i++) {
//       for (let j = 0; j < madj.size; j++) {
//         const idx = i * madj.size + j;
//         boxes.push(
//           <Box
//             key={idx}
//             value={madj.board[i][j] || null}
//             onClick={() => {
//               if (madj.board[i][j] === "") {
//                 const currentPlayer = madj.xScore + madj.oScore % 2 === 0 ? "X" : "O";
//                 const success = madj.placeMark(i, j, currentPlayer);
//                 if (success) {
//                   onMarkPlaced(); // Mise à jour du composant parent
//                 }
//               }
//             }}
//           />
//         );
//       }
//     }
//     return boxes;
//   };

//   return (
//     <div className="board">{renderBoxes()}</div>
//   );
// };

// export default Board;

