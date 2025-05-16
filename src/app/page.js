'use client';

import { Link } from "lucide-react";
import { useState } from "react";


export default function Gameboard() {
  const [playableGridPosition, setPlayableGridPosition] = useState({ row: 0, col: 0 });
  const [board, setBoard] = useState(() =>
    Array(5).fill(null).map(() => Array(5).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState("X"); 
  const [selectedPiece, setSelectedPiece] = useState(null); // Will store { row, col }
  const [winner, setWinner] = useState(null)
  const [lastAction, setLastAction] = useState("place"); // "place", "move", or "grid"

 

  function moveGrid(direction) {
    if (lastAction === "grid") {
      alert("You must place or move a piece before moving the grid again.");
      return;
    }
  
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
      setLastAction("grid"); // mark that a grid move was the last action
    }
  }
  
  // Example usage
  //  moveGrid("DOWN");

  function countPlayerPieces(board, player) {
    return board.flat().filter(cell => cell === player).length;
  }

  function checkWinInActiveGrid(board, player, gridPos) {
    const { row, col } = gridPos;
  
    // Check rows
    for (let r = row; r < row + 3; r++) {
      if (
        board[r][col] === player &&
        board[r][col + 1] === player &&
        board[r][col + 2] === player
      ) {
        return true;
      }
    }
  
    // Check columns
    for (let c = col; c < col + 3; c++) {
      if (
        board[row][c] === player &&
        board[row + 1][c] === player &&
        board[row + 2][c] === player
      ) {
        return true;
      }
    }
  
    // Check diagonals
    if (
      board[row][col] === player &&
      board[row + 1][col + 1] === player &&
      board[row + 2][col + 2] === player
    ) {
      return true;
    }
  
    if (
      board[row][col + 2] === player &&
      board[row + 1][col + 1] === player &&
      board[row + 2][col] === player
    ) {
      return true;
    }
  
    return false;
  }  
  

  function handleCellClick(rowIndex, colIndex) {
    if (winner) return; // Don't allow moves if game is over

    const { row, col } = playableGridPosition;
    const inActiveGrid =
      rowIndex >= row && rowIndex < row + 3 &&
      colIndex >= col && colIndex < col + 3;
  
    const newBoard = board.map(row => [...row]);
  
    const currentPieceCount = countPlayerPieces(board, currentPlayer);
  
    const cellValue = board[rowIndex][colIndex];
  
    // Select piece to move (can be outside grid)
    if (cellValue === currentPlayer && !selectedPiece) {
      setSelectedPiece({ row: rowIndex, col: colIndex });
      return;
    }
  
    // If a piece is selected, move it (must be inside active grid)
    if (selectedPiece) {
      const { row: fromRow, col: fromCol } = selectedPiece;
  
      if (!inActiveGrid || cellValue !== null) return; // Only move into empty active grid
  
      // Move piece
      newBoard[fromRow][fromCol] = null;
      newBoard[rowIndex][colIndex] = currentPlayer;

      setBoard(newBoard);

      setLastAction("move"); // If a piece was moved

      if (checkWinInActiveGrid(newBoard, currentPlayer, playableGridPosition)) {
        setWinner(currentPlayer)
        return;
      }
      
      setSelectedPiece(null);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      return;
    }
   
    // If placing new piece (and under limit), must be in active grid
    if (cellValue === null && inActiveGrid && currentPieceCount < 4) {
      newBoard[rowIndex][colIndex] = currentPlayer;
      setBoard(newBoard);
      setLastAction("place"); // If a piece was placed

      if (checkWinInActiveGrid(newBoard, currentPlayer, playableGridPosition)) {
        setWinner(currentPlayer)
        return;
      }
      
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }
  
  function resetGame() {
    const emptyBoard = Array(5).fill(null).map(() => Array(5).fill(null));
    setBoard(emptyBoard);
    setCurrentPlayer("X");
    setWinner(null);
    setPlayableGridPosition({ row: 0, col: 0 });
    setSelectedPiece(null); // if you're using piece selection
  }
  
  
  


  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 space-y-4">
      
      {/* Game Board */}
      <div className="grid grid-rows-5 gap-1">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((cell, colIndex) => {
              const inActiveGrid =
                rowIndex >= playableGridPosition.row &&
                rowIndex < playableGridPosition.row + 3 &&
                colIndex >= playableGridPosition.col &&
                colIndex < playableGridPosition.col + 3;
  
              const isSelected =
                selectedPiece?.row === rowIndex &&
                selectedPiece?.col === colIndex;
  
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    w-16 h-16 border flex items-center justify-center cursor-pointer
                    ${inActiveGrid ? "border-green-500" : "border-gray-400"}
                    ${isSelected ? "bg-yellow-200" : ""}
                  `}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              );
            })}
          </div>
        ))}
      </div>
  
      {/* Grid Movement Controls */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => moveGrid("UP")} className="px-3 py-1 text-black bg-gray-200 rounded">Up</button>
        <button onClick={() => moveGrid("DOWN")} className="px-3 py-1 text-black bg-gray-200 rounded">Down</button>
        <button onClick={() => moveGrid("LEFT")} className="px-3 py-1 text-black bg-gray-200 rounded">Left</button>
        <button onClick={() => moveGrid("RIGHT")} className="px-3 py-1 text-black bg-gray-200 rounded">Right</button>
      </div>

      {/* Turn Indicator */}
      {!winner && (
        <div className="text-center mb-4 text-lg font-semibold">
          Turn:{" "}
          <span className={`text-${currentPlayer === "X" ? "blue" : "red"}-500`}>
            Player {currentPlayer}
          </span>
        </div>
      )}
  
      {/* Winner Message + Reset */}
      {winner && (
        <div className="text-center mt-6">
          <p className="text-xl font-bold text-green-600 mb-2">{winner} wins!</p>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reset Game
          </button>
        </div>
      )}
    </div>
  );    
}