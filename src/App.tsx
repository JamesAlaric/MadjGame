import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import ResetButton from "./components/resetButton";
import ScoreBoard from "./components/scoreBoard";
import { Madj } from "./madj"; // Assurez-vous que le chemin d'import est correct
import "./App.css";
import goldTrophy from './assets/trophy.png';
import DrawIcon from './assets/hired.png'


const App: React.FC = () => {
  const [size, setSize] = useState<number>(0); // Taille initiale du plateau
  const [madj, setMadj] = useState(new Madj(size, size)); // Créez une instance de Madj avec la taille initiale
  const [xPlaying, setXPlaying] = useState(true);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleBoxClick = (i: number, j: number) => {
    if (!madj.isGameOver()) {
      const currentPlayer = xPlaying ? "X" : "O";
      if (madj.placeMark(i, j, currentPlayer)) {
        setMadj((prevMadj) => {
          const newMadj = new Madj(
            prevMadj.size,
            prevMadj.nombreDePionsPourVictoire
          );
          newMadj.board = prevMadj.board.map((row) => [...row]);
          newMadj.xScore = prevMadj.xScore;
          newMadj.oScore = prevMadj.oScore;
          // Ici, vous pouvez traiter la logique de fin de jeu
          if (newMadj.isGameOver()) {
            const winner = newMadj.detectionVictoire("X")
              ? "X"
              : newMadj.detectionVictoire("O")
              ? "O"
              : null;
            setGameOverMessage(
              winner ? `Le gagnant est ${winner}.` : "Match nul."
            );
            setIsModalVisible(true); // Affiche le modal
          }

          return newMadj;
        });
        setXPlaying(!xPlaying);
        setErrorMessage(""); // Efface le message d'erreur précédent
      } else {
        setErrorMessage("Mouvement invalide");
      }
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setGameOverMessage("");
    resetGame();
  };

  const resetGame = () => {
    setMadj(new Madj(size, size));
    setXPlaying(true);
    setGameOverMessage("");
  };

  return (
    <>
      <div className="game-container">
        <ScoreBoard
          scores={{ xScore: madj.xScore, oScore: madj.oScore }}
          xPlaying={xPlaying}
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <Board
          size={size}
          onSizeChange={handleSizeChange}
          board={madj.board}
          onBoxClick={handleBoxClick}
        />
         {isModalVisible && (
          <div className="modal-overlay">
            <div className="game-over-modal">
              <button className="close-modal" onClick={closeModal}>
                &times;
              </button>
              <img
                src={gameOverMessage.includes("gagnant") ? goldTrophy : DrawIcon}
                alt={gameOverMessage.includes("gagnant") ? 'Gagnant' : 'Match nul'}
                className="game-over-image"
              />
              <div className="game-over-message">{gameOverMessage}</div>
            </div>
          </div>
        )}

        <ResetButton resetBoard={resetGame} />
      </div>
    </>
  );
};

export default App;
