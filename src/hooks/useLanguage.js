import { useState, useEffect } from 'react';
import { generateWordSet } from '@services/Words';
import { LANGUAGES } from '@constants/gameConstants';

/**
 * Hook for managing language and word loading
 */
export const useLanguage = () => {
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH);
  const [wordSet, setWordSet] = useState(new Set());
  const [correctWord, setCorrectWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load word list when language changes
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    generateWordSet(language)
      .then(words => {
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord.toUpperCase());
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load word list:', err);
        setError('Failed to load word list. Please refresh the page.');
        setIsLoading(false);
      });
  }, [language]);

  return {
    language,
    setLanguage,
    wordSet,
    correctWord,
    setCorrectWord,
    isLoading,
    error,
  };
};
