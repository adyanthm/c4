import { useState, useEffect } from "react";
import useSound from "../hooks/useSound";

const Connect4Board = ({
  difficulty,
  onMove,
  board,
  isGameOver,
  currentPlayer,
}) => {
  const { playMove } = useSound();
  const [animatingCol, setAnimatingCol] = useState(null);
  const [animatingRow, setAnimatingRow] = useState(null);

  const handleColumnClick = async (col) => {
    if (isGameOver || currentPlayer !== "human") return;

    // Find the row where the piece will land
    let targetRow = -1;
    for (let row = 5; row >= 0; row--) {
      if (board[row][col] === 0) {
        targetRow = row;
        break;
      }
    }

    if (targetRow === -1) return; // Column is full

    setAnimatingCol(col);
    setAnimatingRow(0);

    // Animate the piece falling
    for (let row = 0; row <= targetRow; row++) {
      setAnimatingRow(row);
      playMove();
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    setAnimatingCol(null);
    setAnimatingRow(null);
    onMove(col);
  };

  return (
    <div className="grid gap-1 sm:gap-2 bg-blue-800 p-2 sm:p-4 rounded-lg">
      {Array(6)
        .fill(null)
        .map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 sm:gap-2">
            {Array(7)
              .fill(null)
              .map((_, colIndex) => (
                <div
                  key={colIndex}
                  onClick={() => handleColumnClick(colIndex)}
                  className={`w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full cursor-pointer transition-all duration-150
                ${
                  board[rowIndex][colIndex] === 0
                    ? "bg-white hover:bg-gray-200"
                    : ""
                }
                ${board[rowIndex][colIndex] === 1 ? "bg-red-500" : ""}
                ${board[rowIndex][colIndex] === 2 ? "bg-yellow-500" : ""}
                ${
                  animatingCol === colIndex && animatingRow === rowIndex
                    ? "scale-110"
                    : ""
                }`}
                />
              ))}
          </div>
        ))}
    </div>
  );
};

export default Connect4Board;
