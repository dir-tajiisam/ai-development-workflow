'use client';

import { useEffect } from 'react';

import { useTetris } from '@/app/hooks/useTetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/app/types/tetris';

export default function TetrisPage() {
  const {
    gameState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause,
    resetGame,
  } = useTetris();

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isGameOver, moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause]);

  // Render the game board with current piece
  const renderBoard = () => {
    const displayBoard = gameState.board.map(row => [...row]);

    // Draw current piece on board
    if (gameState.currentPiece) {
      const { shape, position, color } = gameState.currentPiece;
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            const boardY = position.y + y;
            const boardX = position.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = color;
            }
          }
        }
      }
    }

    return displayBoard;
  };

  // Render next piece preview
  const renderNextPiece = () => {
    if (!gameState.nextPiece) return null;
    const { shape, color } = gameState.nextPiece;
    return (
      <div className="inline-grid gap-[2px] bg-slate-800 p-4 rounded-lg">
        {shape.map((row, y) => (
          <div key={y} className="flex gap-[2px]">
            {row.map((cell, x) => (
              <div
                key={x}
                className="w-6 h-6 border border-slate-700 rounded-sm"
                style={{
                  backgroundColor: cell ? color : '#1e293b',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  const displayBoard = renderBoard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">TETRIS</h1>
          <p className="text-slate-400">Use arrow keys to play, Space for hard drop, P to pause</p>
        </div>

        <div className="flex gap-8 items-start justify-center">
          {/* Main Game Board */}
          <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl">
            <div className="inline-grid gap-[2px] bg-slate-900 p-2 rounded-lg">
              {displayBoard.map((row, y) => (
                <div key={y} className="flex gap-[2px]">
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      className="w-8 h-8 border border-slate-700 rounded-sm transition-colors duration-100"
                      style={{
                        backgroundColor: cell || '#0f172a',
                        boxShadow: cell ? 'inset 0 0 10px rgba(255,255,255,0.2)' : 'none',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Game Over Overlay */}
            {gameState.isGameOver && (
              <div className="mt-4 text-center">
                <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl mb-4">
                  GAME OVER
                </div>
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Play Again
                </button>
              </div>
            )}

            {/* Pause Overlay */}
            {gameState.isPaused && !gameState.isGameOver && (
              <div className="mt-4 text-center">
                <div className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
                  PAUSED
                </div>
              </div>
            )}
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Score */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-slate-400 text-sm font-medium mb-2">SCORE</h2>
              <p className="text-4xl font-bold text-white">{gameState.score}</p>
            </div>

            {/* Next Piece */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-slate-400 text-sm font-medium mb-4">NEXT</h2>
              {renderNextPiece()}
            </div>

            {/* Controls */}
            <div className="bg-slate-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-slate-400 text-sm font-medium mb-4">CONTROLS</h2>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <span>Move:</span>
                  <span className="font-mono">← →</span>
                </div>
                <div className="flex justify-between">
                  <span>Rotate:</span>
                  <span className="font-mono">↑</span>
                </div>
                <div className="flex justify-between">
                  <span>Soft Drop:</span>
                  <span className="font-mono">↓</span>
                </div>
                <div className="flex justify-between">
                  <span>Hard Drop:</span>
                  <span className="font-mono">Space</span>
                </div>
                <div className="flex justify-between">
                  <span>Pause:</span>
                  <span className="font-mono">P</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={togglePause}
                disabled={gameState.isGameOver}
                className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {gameState.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetGame}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
