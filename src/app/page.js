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
  const [lastAction, setLastAction] = useState("place");
  const [lastGridPosition, setLastGridPosition] = useState(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);


 

  function moveGrid(direction) {
    if (winner) return;
    // if (lastAction === "grid") {
    //   alert("You must place or move a piece before moving the grid again.");
    //   return;
    // }
  
    const { row, col } = playableGridPosition;
    let newRow = row;
    let newCol = col;
  
    if (direction === "UP" && row > 0) newRow--;
    else if (direction === "DOWN" && row < 2) newRow++;
    else if (direction === "LEFT" && col > 0) newCol--;
    else if (direction === "RIGHT" && col < 2) newCol++;
  
    const newPosition = { row: newRow, col: newCol };
  
    // Prevent toggling back
    if (
      lastGridPosition &&
      newRow === lastGridPosition.row &&
      newCol === lastGridPosition.col &&
      lastAction === "grid"
    ) {
      alert("You cannot move back to the previous grid position immediately.");
      return;
    }

  
    if (newRow !== row || newCol !== col) {
      setPlayableGridPosition(newPosition);
      setLastGridPosition({ row, col }); // store current as last
      setSelectedPiece(null); // clear any selected piece
      setLastAction("grid");
      
      // Check win immediately after grid move
      if (checkWinInActiveGrid(board, currentPlayer, newPosition)) {
        setWinner(currentPlayer);
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    }
  }
  

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
    if (winner) return;
  
    const { row, col } = playableGridPosition;
    const inActiveGrid =
      rowIndex >= row && rowIndex < row + 3 &&
      colIndex >= col && colIndex < col + 3;
  
    const newBoard = board.map(row => [...row]);
    const currentPieceCount = countPlayerPieces(board, currentPlayer);
    const cellValue = board[rowIndex][colIndex];
  
    // ✅ Handle selection/deselection
    if (cellValue === currentPlayer) {
      if (selectedPiece &&
          selectedPiece.row === rowIndex &&
          selectedPiece.col === colIndex) {
        setSelectedPiece(null); // deselect
      } else {
        setSelectedPiece({ row: rowIndex, col: colIndex }); // select
      }
      return;
    }
  
    // ✅ Move selected piece (must be into empty cell in active grid)
    if (selectedPiece) {
      const { row: fromRow, col: fromCol } = selectedPiece;
  
      if (!inActiveGrid || cellValue !== null) return;
  
      newBoard[fromRow][fromCol] = null;
      newBoard[rowIndex][colIndex] = currentPlayer;
      setBoard(newBoard);
      setSelectedPiece(null);
      setLastAction("move");
  
      if (checkWinInActiveGrid(newBoard, currentPlayer, playableGridPosition)) {
        setWinner(currentPlayer);
        return;
      }
  
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      return;
    }
  
    // ✅ Place new piece if under limit
    if (cellValue === null && inActiveGrid && currentPieceCount < 4) {
      newBoard[rowIndex][colIndex] = currentPlayer;
      setBoard(newBoard);
      setLastAction("place");
  
      if (checkWinInActiveGrid(newBoard, currentPlayer, playableGridPosition)) {
        setWinner(currentPlayer);
        return;
      }
  
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }
  
  
  function resetGame() {
    setBoard(Array(5).fill(null).map(() => Array(5).fill(null)));
    setPlayableGridPosition({ row: 1, col: 1 });
    setCurrentPlayer("X");
    setSelectedPiece(null);
    setWinner(null);
    setLastAction(null);
    setLastGridPosition(null);
  }
  
  
  
  


  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 space-y-4">
      <h1 className="text-6xl mb-16 mt-10">GridTactix</h1>
      <button
        onClick={() => setShowHowToPlay(true)}
        className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
      >
        How to Play
      </button>

      
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

      {showHowToPlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-center text-black">How to Play: GridTactix</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm leading-relaxed max-h-[60vh] overflow-y-auto">
              <li>The game board is 5x5, but only a 3x3 section is active at a time.</li>
              <li>Each player (X or O) can place a maximum of 4 pieces on the board.</li>
              <li>You can place a piece in an empty cell inside the active 3x3 grid if you have not reached 4 pieces yet.</li>
              <li>If you have placed 4 pieces, you must move one of your existing pieces instead of placing a new one.</li>
              <li>You can only move your piece to an empty cell inside the active grid.</li>
              <li>You can move the active 3x3 grid using the arrow buttons (Up, Down, Left, Right).</li>
              <li>You are not allowed to move the grid twice in a row. You must place or move a piece before moving it again.</li>
              <li>Each grid movement counts as a turn and passes the move to the other player.</li>
              <li>The first player to form a line of 3 of their pieces (row, column, or diagonal) inside the active grid wins!</li>
            </ol>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-lg"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );    
}