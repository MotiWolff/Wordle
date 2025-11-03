import { useCallback } from 'react';
import { WORD_LENGTH, MAX_ATTEMPTS } from '@constants/gameConstants';

/**
 * Hook for managing game actions (letter input, delete, enter)
 */
export const useGameActions = ({
  board,
  setBoard,
  currAttempt,
  setCurrAttempt,
  gameOver,
  language,
  wordSet,
  correctWord,
  keyColors,
  setKeyColors,
  showToast,
  markGameWon,
  markGameLost,
  recordWin,
  recordLoss,
}) => {
  /**
   * Type a letter into the current row
   */
  const onSelectLetter = useCallback(
    keyVal => {
      if (gameOver.gameOver) return;
      if (currAttempt.letterPos >= WORD_LENGTH) return;

      const newBoard = board.map(row => [...row]);

      // For Hebrew, fill from right to left (position 4 -> 0)
      const actualPos =
        language === 'hebrew'
          ? WORD_LENGTH - 1 - currAttempt.letterPos
          : currAttempt.letterPos;

      newBoard[currAttempt.attempt][actualPos] = keyVal;
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos + 1,
      });
    },
    [board, currAttempt, gameOver, language, setBoard, setCurrAttempt]
  );

  /**
   * Backspace one letter
   */
  const onDelete = useCallback(() => {
    if (gameOver.gameOver) return;
    if (currAttempt.letterPos === 0) return;

    const newBoard = board.map(row => [...row]);

    // For Hebrew, delete from right to left
    const actualPos =
      language === 'hebrew'
        ? WORD_LENGTH - currAttempt.letterPos
        : currAttempt.letterPos - 1;

    newBoard[currAttempt.attempt][actualPos] = '';
    setBoard(newBoard);
    setCurrAttempt({
      ...currAttempt,
      letterPos: currAttempt.letterPos - 1,
    });
  }, [board, currAttempt, gameOver, language, setBoard, setCurrAttempt]);

  /**
   * Submit the row
   */
  const onEnter = useCallback(() => {
    if (gameOver.gameOver) return;
    if (currAttempt.letterPos !== WORD_LENGTH) return;

    // Build the word from the board
    let currWord = '';
    for (let i = 0; i < WORD_LENGTH; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    // For Hebrew, reverse the word to match the actual reading order
    if (language === 'hebrew') {
      currWord = currWord.split('').reverse().join('');
    }

    if (wordSet.has(currWord.toLowerCase())) {
      // Update keyboard colors for this guess
      const newKeyColors = { ...keyColors };

      // Compare each character in the actual word (currWord) with correctWord
      for (let i = 0; i < WORD_LENGTH; i++) {
        const letter = currWord[i];
        const isCorrect = correctWord[i] === letter;
        const isAlmost = !isCorrect && correctWord.includes(letter);

        // Priority: correct > almost > error
        // Only update if the new status is better than the current one
        if (isCorrect) {
          newKeyColors[letter] = 'correct';
        } else if (isAlmost && newKeyColors[letter] !== 'correct') {
          newKeyColors[letter] = 'almost';
        } else if (!newKeyColors[letter]) {
          newKeyColors[letter] = 'error';
        }
      }
      setKeyColors(newKeyColors);

      // Advance so the submitted row reveals colors
      const nextAttempt = { attempt: currAttempt.attempt + 1, letterPos: 0 };

      // Check if won
      if (currWord === correctWord) {
        setCurrAttempt(nextAttempt);
        markGameWon();
        recordWin(currAttempt.attempt + 1, correctWord, language);
        return;
      }

      // Check if lost (no more attempts)
      if (currAttempt.attempt === MAX_ATTEMPTS - 1) {
        setCurrAttempt(nextAttempt);
        markGameLost();
        recordLoss(correctWord, language);
        return;
      }

      // Continue playing
      setCurrAttempt(nextAttempt);
    } else {
      showToast('Not in word list');
    }
  }, [
    gameOver.gameOver,
    currAttempt,
    language,
    wordSet,
    board,
    keyColors,
    correctWord,
    setKeyColors,
    setCurrAttempt,
    markGameWon,
    markGameLost,
    recordWin,
    recordLoss,
    showToast,
  ]);

  return {
    onSelectLetter,
    onDelete,
    onEnter,
  };
};
