'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

import type {
  GameState,
  Tetromino,
  TetrominoType,
  Position,
} from '@/app/types/tetris';
import {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
  INITIAL_DROP_SPEED,
} from '@/app/types/tetris';

const createEmptyBoard = (): (string | null)[][] => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(null)
  );
};

const getRandomTetromino = (): Tetromino => {
  const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    type,
    shape: TETROMINO_SHAPES[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
    color: TETROMINO_COLORS[type],
  };
};

export function useTetris() {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    currentPiece: null,
    nextPiece: null,
    score: 0,
    isGameOver: false,
    isPaused: false,
  });

  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkCollision = useCallback(
    (piece: Tetromino, board: (string | null)[][], offset: Position = { x: 0, y: 0 }): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const newX = piece.position.x + x + offset.x;
            const newY = piece.position.y + y + offset.y;

            if (
              newX < 0 ||
              newX >= BOARD_WIDTH ||
              newY >= BOARD_HEIGHT ||
              (newY >= 0 && board[newY][newX])
            ) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  const mergePieceToBoard = useCallback(
    (piece: Tetromino, board: (string | null)[][]): (string | null)[][] => {
      const newBoard = board.map(row => [...row]);
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardY = piece.position.y + y;
            const boardX = piece.position.x + x;
            if (boardY >= 0) {
              newBoard[boardY][boardX] = piece.color;
            }
          }
        }
      }
      return newBoard;
    },
    []
  );

  const clearLines = useCallback((board: (string | null)[][]): { newBoard: (string | null)[][]; linesCleared: number } => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== null)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }

    return { newBoard, linesCleared };
  }, []);

  const rotatePiece = useCallback((piece: Tetromino): number[][] => {
    const newShape: number[][] = [];
    const size = piece.shape.length;
    for (let y = 0; y < size; y++) {
      newShape[y] = [];
      for (let x = 0; x < size; x++) {
        newShape[y][x] = piece.shape[size - 1 - x][y];
      }
    }
    return newShape;
  }, []);

  const moveLeft = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const newPiece = {
        ...prev.currentPiece,
        position: { ...prev.currentPiece.position }
      };
      if (!checkCollision(newPiece, prev.board, { x: -1, y: 0 })) {
        newPiece.position.x--;
        return { ...prev, currentPiece: newPiece };
      }
      return prev;
    });
  }, [checkCollision]);

  const moveRight = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const newPiece = {
        ...prev.currentPiece,
        position: { ...prev.currentPiece.position }
      };
      if (!checkCollision(newPiece, prev.board, { x: 1, y: 0 })) {
        newPiece.position.x++;
        return { ...prev, currentPiece: newPiece };
      }
      return prev;
    });
  }, [checkCollision]);

  const moveDown = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const newPiece = {
        ...prev.currentPiece,
        position: { ...prev.currentPiece.position }
      };
      if (!checkCollision(newPiece, prev.board, { x: 0, y: 1 })) {
        newPiece.position.y++;
        return { ...prev, currentPiece: newPiece };
      } else {
        // Lock the piece
        const mergedBoard = mergePieceToBoard(newPiece, prev.board);
        const { newBoard, linesCleared } = clearLines(mergedBoard);
        const newScore = prev.score + linesCleared * 100;

        const nextPiece = prev.nextPiece || getRandomTetromino();
        const newNextPiece = getRandomTetromino();

        // Check game over
        if (checkCollision(nextPiece, newBoard)) {
          return {
            ...prev,
            board: newBoard,
            currentPiece: nextPiece,
            nextPiece: newNextPiece,
            score: newScore,
            isGameOver: true,
          };
        }

        return {
          ...prev,
          board: newBoard,
          currentPiece: nextPiece,
          nextPiece: newNextPiece,
          score: newScore,
        };
      }
    });
  }, [checkCollision, mergePieceToBoard, clearLines]);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      const rotatedShape = rotatePiece(prev.currentPiece);
      const newPiece = { ...prev.currentPiece, shape: rotatedShape };
      if (!checkCollision(newPiece, prev.board)) {
        return { ...prev, currentPiece: newPiece };
      }
      return prev;
    });
  }, [rotatePiece, checkCollision]);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (!prev.currentPiece || prev.isGameOver || prev.isPaused) return prev;
      let newPiece = {
        ...prev.currentPiece,
        position: { ...prev.currentPiece.position }
      };
      while (!checkCollision(newPiece, prev.board, { x: 0, y: 1 })) {
        newPiece.position.y++;
      }

      const mergedBoard = mergePieceToBoard(newPiece, prev.board);
      const { newBoard, linesCleared } = clearLines(mergedBoard);
      const newScore = prev.score + linesCleared * 100;

      const nextPiece = prev.nextPiece || getRandomTetromino();
      const newNextPiece = getRandomTetromino();

      if (checkCollision(nextPiece, newBoard)) {
        return {
          ...prev,
          board: newBoard,
          currentPiece: nextPiece,
          nextPiece: newNextPiece,
          score: newScore,
          isGameOver: true,
        };
      }

      return {
        ...prev,
        board: newBoard,
        currentPiece: nextPiece,
        nextPiece: newNextPiece,
        score: newScore,
      };
    });
  }, [checkCollision, mergePieceToBoard, clearLines]);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const resetGame = useCallback(() => {
    const firstPiece = getRandomTetromino();
    const secondPiece = getRandomTetromino();
    setGameState({
      board: createEmptyBoard(),
      currentPiece: firstPiece,
      nextPiece: secondPiece,
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  // Initialize game
  useEffect(() => {
    if (!gameState.currentPiece && !gameState.isGameOver) {
      resetGame();
    }
  }, [gameState.currentPiece, gameState.isGameOver, resetGame]);

  // Game loop
  useEffect(() => {
    // Clear any existing interval first
    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current);
      dropIntervalRef.current = null;
    }

    // Don't set new interval if game is over or paused
    if (gameState.isGameOver || gameState.isPaused) {
      return;
    }

    // Set new interval
    dropIntervalRef.current = setInterval(() => {
      moveDown();
    }, INITIAL_DROP_SPEED);

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused, moveDown]);

  return {
    gameState,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause,
    resetGame,
  };
}
