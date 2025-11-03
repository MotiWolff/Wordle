import { useState, useCallback } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '@utils/localStorage';
import { STORAGE_KEYS } from '@constants/gameConstants';

const DEFAULT_STATISTICS = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  gameHistory: [],
  firstGameDate: null,
};

/**
 * Hook for managing game statistics
 */
export const useStatistics = () => {
  const [statistics, setStatistics] = useState(() => {
    const saved = getFromLocalStorage(STORAGE_KEYS.STATISTICS, null);

    if (!saved) return DEFAULT_STATISTICS;

    // Merge with defaults to ensure all new fields exist
    return {
      ...DEFAULT_STATISTICS,
      ...saved,
      guessDistribution:
        saved.guessDistribution || DEFAULT_STATISTICS.guessDistribution,
      gameHistory: saved.gameHistory || DEFAULT_STATISTICS.gameHistory,
    };
  });

  /**
   * Record a win
   */
  const recordWin = useCallback((guessCount, correctWord, language) => {
    setStatistics(prev => {
      const newGuessDistribution = { ...prev.guessDistribution };
      newGuessDistribution[guessCount] =
        (newGuessDistribution[guessCount] || 0) + 1;

      const newStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon + 1,
        currentStreak: prev.currentStreak + 1,
        maxStreak: Math.max(prev.maxStreak, prev.currentStreak + 1),
        guessDistribution: newGuessDistribution,
        gameHistory: [
          ...(prev.gameHistory || []),
          {
            date: new Date().toISOString(),
            word: correctWord,
            guesses: guessCount,
            won: true,
            language: language,
          },
        ],
        firstGameDate: prev.firstGameDate || new Date().toISOString(),
      };

      setToLocalStorage(STORAGE_KEYS.STATISTICS, newStats);
      return newStats;
    });
  }, []);

  /**
   * Record a loss
   */
  const recordLoss = useCallback((correctWord, language) => {
    setStatistics(prev => {
      const newStats = {
        gamesPlayed: prev.gamesPlayed + 1,
        gamesWon: prev.gamesWon,
        currentStreak: 0,
        maxStreak: prev.maxStreak,
        guessDistribution: prev.guessDistribution,
        gameHistory: [
          ...(prev.gameHistory || []),
          {
            date: new Date().toISOString(),
            word: correctWord,
            guesses: 6,
            won: false,
            language: language,
          },
        ],
        firstGameDate: prev.firstGameDate || new Date().toISOString(),
      };

      setToLocalStorage(STORAGE_KEYS.STATISTICS, newStats);
      return newStats;
    });
  }, []);

  /**
   * Reset all statistics
   */
  const resetStatistics = useCallback(() => {
    setStatistics(DEFAULT_STATISTICS);
    setToLocalStorage(STORAGE_KEYS.STATISTICS, DEFAULT_STATISTICS);
  }, []);

  return {
    statistics,
    recordWin,
    recordLoss,
    resetStatistics,
  };
};
