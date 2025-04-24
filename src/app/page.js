'use client';

import { Link } from "lucide-react";
import { useState } from "react";




// const initialBoard = Array(5).fill(null).map(() => Array(5).fill(null));
// console.log(initialBoard);


export default function Gameboard() {
  const [playableGridPosition, setPlayableGridPosition] = useState({ row: 0, col: 0 });
  const [board, setBoard] = useState(() =>
    Array(5).fill(null).map(() => Array(5).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("X"); 
  const [selectedPiece, setSelectedPiece] = useState(null); // Will store { row, col }
 

  function moveGrid(direction) {
    const { row, col } = playableGridPosition;
    let newRow = row;
    let newCol = col;
  
    if (direction === "UP" && row > 0) newRow--;
    else if (direction === "DOWN" && row < 2) newRow++;
    else if (direction === "LEFT" && col > 0) newCol--;
    else if (direction === "RIGHT" && col < 2) newCol++;
  
    // Only update if something changed
    if (newRow !== row || newCol !== col) {
      setPlayableGridPosition({ row: newRow, col: newCol });
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      setSelectedPiece(null); // clear any selected piece
    }
  }
  // Example usage
  //  moveGrid("DOWN");

  function countPlayerPieces(board, player) {
    return board.flat().filter(cell => cell === player).length;
  }
  

  function handleCellClick(rowIndex, colIndex) {
    const { row, col } = playableGridPosition;
    const inActiveGrid =
      rowIndex >= row && rowIndex < row + 3 &&
      colIndex >= col && colIndex < col + 3;
  
    const newBoard = board.map(row => [...row]);
  
    const currentPieceCount = countPlayerPieces(board, currentPlayer);
  
    const cellValue = board[rowIndex][colIndex];
  
    // 1️⃣ Select piece to move (can be outside grid)
    if (cellValue === currentPlayer && !selectedPiece) {
      setSelectedPiece({ row: rowIndex, col: colIndex });
      return;
    }
  
    // 2️⃣ If a piece is selected, move it (must be inside active grid)
    if (selectedPiece) {
      const { row: fromRow, col: fromCol } = selectedPiece;
  
      if (!inActiveGrid || cellValue !== null) return; // Only move into empty active grid
  
      // Move piece
      newBoard[fromRow][fromCol] = null;
      newBoard[rowIndex][colIndex] = currentPlayer; 
  
      setBoard(newBoard);
      setSelectedPiece(null);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      return;
    }
  
    // 3️⃣ If placing new piece (and under limit), must be in active grid
    if (cellValue === null && inActiveGrid && currentPieceCount < 4) {
      newBoard[rowIndex][colIndex] = currentPlayer;
      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }
  
  
  


  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="grid grid-rows-5 gap-1">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-16 h-16 border 
                  ${rowIndex >= playableGridPosition.row && rowIndex < playableGridPosition.row + 3 &&
                    colIndex >= playableGridPosition.col && colIndex < playableGridPosition.col + 3
                    ? "border-green-500"
                    : "border-gray-400"
                  }
                  flex items-center justify-center
                `}
              >
                {
                /* Future: show X/O here */
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="w-16 h-16 border border-gray-400 flex items-center justify-center cursor-pointer"
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {board[rowIndex][colIndex]}
                </div>

                }
              </div>
            ))}
          </div>
        ))}
        <div>
          <button onClick={(()=> moveGrid("UP"))}>Up</button>
          <button onClick={(()=> moveGrid("DOWN"))}>DOwn</button>
          <button onClick={(()=> moveGrid("RIGHT"))}>right</button>
          <button onClick={(()=> moveGrid("LEFT"))}>left</button>
        </div>
      </div>
    </div>
  );  
}