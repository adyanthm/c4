import { useState, useEffect } from "react";
import Connect4Board from "../components/Connect4Board";
import { createEmptyBoard, checkWinner } from "../utils/gameLogic";
import { makeAIMove } from "../utils/aiLogic";
import useSound from "../hooks/useSound";
import useConfetti from "../hooks/useConfetti";

export default function Home() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [difficulty, setDifficulty] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState("human");
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const { playMove, playWin } = useSound();
  const fireConfetti = useConfetti();

  const handleMove = (col) => {
    if (gameOver) return;

    const newBoard = [...board];
    // Find the lowest empty row in the selected column
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === 0) {
        newBoard[row][col] = 1; // Human player is 1
        setBoard(newBoard);
        setCurrentPlayer("ai");
        break;
      }
    }
  };

  useEffect(() => {
    if (currentPlayer === "ai" && !gameOver) {
      const aiMoveTimeout = setTimeout(() => {
        const aiMove = makeAIMove(board, difficulty);
        const newBoard = [...board];
        for (let row = 5; row >= 0; row--) {
          if (newBoard[row][aiMove] === 0) {
            newBoard[row][aiMove] = 2; // AI player is 2
            setBoard(newBoard);
            setCurrentPlayer("human");
            break;
          }
        }
      }, 500);

      return () => clearTimeout(aiMoveTimeout);
    }
  }, [currentPlayer, board, difficulty]);

  useEffect(() => {
    const winner = checkWinner(board);
    if (winner) {
      setGameOver(true);
      setWinner(winner);
      playWin();
      fireConfetti(); // Fire confetti
      if (winner === 1) {
        setScores((prev) => ({ ...prev, player: prev.player + 1 }));
      } else if (winner === 2) {
        setScores((prev) => ({ ...prev, ai: prev.ai + 1 }));
      }
    }
  }, [board, playWin, fireConfetti]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("human");
    setGameOver(false);
    setWinner(null);
    setShowConfetti(false); // Stop confetti
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 relative">
      <div className="absolute right-8 top-8 text-right">
        <div className="text-3xl text-gray-300 font-bold tracking-wider">
          Built By <span className="text-blue-400 font-extrabold">ARADHYA</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Connect 4</h1>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <label className="mr-2">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="p-2 rounded border"
            >
              <option value={1}>Level 1 - Easy</option>
              <option value={2}>Level 2 - Beginner</option>
              <option value={3}>Level 3 - Intermediate</option>
              <option value={4}>Level 4 - Hard</option>
              <option value={5}>Level 5 - Expert</option>
            </select>
          </div>

          <button
            onClick={resetGame}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            New Game
          </button>
        </div>

        <div className="text-center mb-4">
          <div className="text-xl font-bold">
            Player: {scores.player} | AI: {scores.ai}
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <Connect4Board
            board={board}
            difficulty={difficulty}
            onMove={handleMove}
            isGameOver={gameOver}
            currentPlayer={currentPlayer}
          />
        </div>

        {gameOver && (
          <div className="text-center">
            <h2 className="text-2xl mb-4">
              {winner === 1 ? "You won!" : winner === 2 ? "AI won!" : "Draw!"}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
