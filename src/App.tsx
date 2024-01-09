import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import ResetButton from "./components/resetButton";
import ScoreBoard from "./components/scoreBoard";
import { Madj } from "./madj"; // Assurez-vous que le chemin d'import est correct
import "./App.css";

const App: React.FC = () => {
  const [size, setSize] = useState<number>(0); // Taille initiale du plateau
  const [madj, setMadj] = useState(new Madj(size, size)); // Créez une instance de Madj avec la taille initiale
  const [xPlaying, setXPlaying] = useState(true);
  const [gameOverMessage, setGameOverMessage] = useState("");

  useEffect(() => {
    setMadj(new Madj(size, size)); // Réinitialiser Madj lorsque la taille change
  }, [size]);

  const handleSizeChange = (newSize: number) => {
    setSize(newSize); // Cela déclenchera l'effet useEffect pour recréer l'instance de Madj avec la nouvelle taille
  };

  const handleBoxClick = (i: number, j: number) => {
    if (madj.board[i][j] === "" && !madj.isGameOver()) {
      const currentPlayer = xPlaying ? "X" : "O";
      if (madj.placeMark(i, j, currentPlayer)) {
        setXPlaying(!xPlaying); // Basculez le joueur actuel
        if (madj.isGameOver()) {
          const winner = madj.detectionVictoire("X")
            ? "X"
            : madj.detectionVictoire("O")
            ? "O"
            : null;
          setGameOverMessage(
            winner ? `Le gagnant est ${winner}.` : "Match nul."
          );
        }
      }
    }
  };

  const resetGame = () => {
    setMadj(new Madj(size, size));
    setXPlaying(true);
    setGameOverMessage("");
  };

  return (
    <>
      <ScoreBoard
        scores={{ xScore: madj.xScore, oScore: madj.oScore }}
        xPlaying={xPlaying}
      />
      {/* <Board size={size} board={madj.board} onBoxClick={handleBoxClick} /> */}
      <Board
        size={size}
        onSizeChange={handleSizeChange}
        board={madj.board}
        onBoxClick={handleBoxClick}
      />
      {gameOverMessage && (
        <div className="game-over-message">{gameOverMessage}</div>
      )}
      <ResetButton resetBoard={resetGame} />
    </>
  );
};

export default App;
