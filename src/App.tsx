import React, { useState, useEffect } from "react";
import Board from "./components/Board";
import ResetButton from "./components/resetButton";
import ScoreBoard from "./components/scoreBoard";
import { Madj } from "./madj"; // Assurez-vous que le chemin d'import est correct
import "./App.css";
import Input from "./components/input";
import goldTrophy from "../public/trophy.png";
import DrawIcon from "../public/hired.png";

const App: React.FC = () => {
  const [size, setSize] = useState<number>(0); // Taille initiale du plateau
  const [madj, setMadj] = useState(new Madj(size, size)); // Créez une instance de Madj avec la taille initiale
  const [xPlaying, setXPlaying] = useState(true);
  const [gameOverMessage, setGameOverMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [xScore, setXScore] = useState(0);
  const [oScore, setOScore] = useState(0);

  useEffect(() => {
    setMadj(new Madj(size, size)); // Réinitialiser Madj lorsque la taille change
    setXPlaying(Math.random() < 0.5);
    setXScore(0);
    setOScore(0);
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
        madj.updateScores(); // Mettez à jour les scores
        setXScore(madj.xScore);
        setOScore(madj.oScore);
        console.log(`State scores: X - ${xScore}, O - ${oScore}`);
        // Créez une copie superficielle de l'objet madj et mettez à jour l'état avec cette copie
        setMadj((prevMadj) => {
          const newMadj = Object.assign(
            Object.create(Object.getPrototypeOf(prevMadj)),
            prevMadj
          );
          newMadj.board = prevMadj.board.map((innerRow) => [...innerRow]);
          newMadj.xScore = prevMadj.xScore; // Copiez le score de X
          newMadj.oScore = prevMadj.oScore; // Copiez le score de O
          return newMadj;
        });
        setXPlaying(!xPlaying); // Changez le joueur actif
      } else {
        setErrorMessage("Coup non valide !");
      }
    }

    // Vérifiez ici si le jeu est terminé et mettez à jour le message de fin de jeu si nécessaire
    if (madj.isGameOver()) {
      const winner = madj.detectionVictoire("X")
        ? "X"
        : madj.detectionVictoire("O")
        ? "O"
        : null;
      setGameOverMessage(winner ? `Le gagnant est ${winner}.` : "Match nul.");
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setGameOverMessage("");
    //resetGame();
  };

  const resetGame = () => {
    madj.resetScores(); // Réinitialisez les scores
    setMadj(new Madj(size, size));
    setXScore(0); // Reset the score for X
    setOScore(0); // Reset the score for O
    setXPlaying(true);
    setGameOverMessage("");
  };

  return (
    <>
      <div className="game-container">
        <div className="left-section">
          <ScoreBoard scores={{ xScore, oScore }} xPlaying={xPlaying} />
          <Input
            value={size || ""}
            onChange={(e) => handleSizeChange(parseInt(e.target.value, 10))}
          />
          <ResetButton resetBoard={resetGame} />
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {isModalVisible && (
          <div className="modal-overlay">
            <div className="game-over-modal">
              <button className="close-modal" onClick={closeModal}>
                &times;
              </button>
              <img
                src={
                  gameOverMessage.includes("gagnant") ? goldTrophy : DrawIcon
                }
                alt={
                  gameOverMessage.includes("gagnant") ? "Gagnant" : "Match nul"
                }
                className="game-over-image"
              />
              <div className="game-over-message">{gameOverMessage}</div>
            </div>
          </div>
        )}

        <div className="right-section">
          <Board size={size} board={madj.board} onBoxClick={handleBoxClick} />
        </div>
      </div>
    </>
  );
};

export default App;
