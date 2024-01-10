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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMadj(new Madj(size, size)); // Réinitialiser Madj lorsque la taille change
  }, [size]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 1000); // Définit un minuteur pour effacer le message après 1 seconde

      return () => clearTimeout(timer); // Nettoie le minuteur si le composant est démonté
    }
  }, [errorMessage]);

  const handleSizeChange = (newSize: number) => {
    setSize(newSize); // Cela déclenchera l'effet useEffect pour recréer l'instance de Madj avec la nouvelle taille
  };

  // const handleBoxClick = (i: number, j: number) => {
  //   if (madj.board[i][j] === "" && !madj.isGameOver()) {
  //     const currentPlayer = xPlaying ? "X" : "O";
  //     if (madj.placeMark(i, j, currentPlayer)) {
  //       setXPlaying(!xPlaying); // Basculez le joueur actuel
  //       if (madj.isGameOver()) {
  //         const winner = madj.detectionVictoire("X")
  //           ? "X"
  //           : madj.detectionVictoire("O")
  //           ? "O"
  //           : null;
  //         setGameOverMessage(
  //           winner ? `Le gagnant est ${winner}.` : "Match nul."
  //         );
  //       }
  //     }
  //   }
  // };

  const handleBoxClick = (i: number, j: number) => {
  if (!madj.isGameOver()) {
    const currentPlayer = xPlaying ? "X" : "O";
    const isValidMove = madj.placeMark(i, j, currentPlayer);
    
    
    if (isValidMove) {
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
        setErrorMessage(""); // Efface le message d'erreur précédent
      }
    } else {
      setErrorMessage('Mouvement invalide');
      console.log('Mouvement invalide'); // Affiche un message dans la console
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
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
