import { useMemo, useCallback } from 'react';
import { useGameState } from '@hooks/useGameState';
import { useLanguage } from '@hooks/useLanguage';
import { useStatistics } from '@hooks/useStatistics';
import { useGameActions } from '@hooks/useGameActions';
import { generateWordSet } from '@services/Words';
import { AppContext } from './AppContext';

export const AppProvider = ({ children }) => {
  // Initialize all hooks
  const gameState = useGameState();
  const languageState = useLanguage();
  const statisticsState = useStatistics();

  // Game actions hook needs data from other hooks
  const gameActions = useGameActions({
    board: gameState.board,
    setBoard: gameState.setBoard,
    currAttempt: gameState.currAttempt,
    setCurrAttempt: gameState.setCurrAttempt,
    gameOver: gameState.gameOver,
    language: languageState.language,
    wordSet: languageState.wordSet,
    correctWord: languageState.correctWord,
    keyColors: gameState.keyColors,
    setKeyColors: gameState.setKeyColors,
    showToast: gameState.showToast,
    markGameWon: gameState.markGameWon,
    markGameLost: gameState.markGameLost,
    recordWin: statisticsState.recordWin,
    recordLoss: statisticsState.recordLoss,
  });

  /**
   * Restart the game with optional new language
   */
  const onRestart = useCallback(
    newLanguage => {
      gameState.resetGameState();

      const langToUse = newLanguage || languageState.language;
      if (newLanguage && newLanguage !== languageState.language) {
        languageState.setLanguage(newLanguage);
      } else {
        // If language didn't change, manually reload the word
        generateWordSet(langToUse)
          .then(words => {
            // Update word set and correct word through language state
            languageState.setCorrectWord(words.todaysWord.toUpperCase());
          })
          .catch(error => {
            console.error('Failed to load word list:', error);
            gameState.showToast(
              'Failed to load word list. Please refresh the page.'
            );
          });
      }
    },
    [gameState, languageState]
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      // Game State
      board: gameState.board,
      setBoard: gameState.setBoard,
      currAttempt: gameState.currAttempt,
      setCurrAttempt: gameState.setCurrAttempt,
      keyColors: gameState.keyColors,
      disabledLetters: gameState.disabledLetters,
      setDisabledLetters: gameState.setDisabledLetters,
      gameOver: gameState.gameOver,
      toast: gameState.toast,
      showToast: gameState.showToast,
      hideToast: gameState.hideToast,
      getGameStatus: gameState.getGameStatus,

      // Language State
      language: languageState.language,
      setLanguage: languageState.setLanguage,
      wordSet: languageState.wordSet,
      correctWord: languageState.correctWord,
      isLoading: languageState.isLoading,
      error: languageState.error,

      // Statistics
      statistics: statisticsState.statistics,
      resetStatistics: statisticsState.resetStatistics,

      // Game Actions
      onSelectLetter: gameActions.onSelectLetter,
      onDelete: gameActions.onDelete,
      onEnter: gameActions.onEnter,
      onRestart,

      // Deprecated/Compatibility (for backward compatibility during transition)
      setToast: gameState.showToast,
      setGameOver: () => {}, // No-op, use markGameWon/markGameLost instead
    }),
    [gameState, languageState, statisticsState, gameActions, onRestart]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
