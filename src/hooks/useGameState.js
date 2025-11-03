import { useState, useCallback } from 'react';
import { boardDefault } from '@services/Words';
import { GAME_STATES } from '@constants/gameConstants';

/**
 * Hook for managing core game state
 */
export const useGameState = () => {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [keyColors, setKeyColors] = useState({}); // keyboard letter status
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [toast, setToast] = useState({
    open: false,
    message: '',
  });

  /**
   * Show a toast message
   */
  const showToast = useCallback((message) => {
    setToast({ open: true, message });
  }, []);

  /**
   * Hide the toast
   */
  const hideToast = useCallback(() => {
    setToast({ open: false, message: '' });
  }, []);

  /**
   * Reset the game state
   */
  const resetGameState = useCallback(() => {
    setBoard(boardDefault);
    setCurrAttempt({ attempt: 0, letterPos: 0 });
    setKeyColors({});
    setDisabledLetters([]);
    setGameOver({ gameOver: false, guessedWord: false });
  }, []);

  /**
   * Mark game as won
   */
  const markGameWon = useCallback(() => {
    setGameOver({ gameOver: true, guessedWord: true });
  }, []);

  /**
   * Mark game as lost
   */
  const markGameLost = useCallback(() => {
    setGameOver({ gameOver: true, guessedWord: false });
  }, []);

  /**
   * Get current game status
   */
  const getGameStatus = useCallback(() => {
    if (gameOver.guessedWord) return GAME_STATES.WON;
    if (gameOver.gameOver) return GAME_STATES.LOST;
    return GAME_STATES.PLAYING;
  }, [gameOver]);

  return {
    board,
    setBoard,
    currAttempt,
    setCurrAttempt,
    keyColors,
    setKeyColors,
    disabledLetters,
    setDisabledLetters,
    gameOver,
    toast,
    showToast,
    hideToast,
    resetGameState,
    markGameWon,
    markGameLost,
    getGameStatus,
  };
};
