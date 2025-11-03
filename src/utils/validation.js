import { WORD_LENGTH, LETTER_STATES } from '@constants/gameConstants';

/**
 * Check if a word is valid (correct length)
 * @param {string} word - The word to validate
 * @returns {boolean} True if valid
 */
export const isValidWord = word => {
  return word && word.length === WORD_LENGTH;
};

/**
 * Check if a word exists in the word list
 * @param {string} word - The word to check
 * @param {string[]} wordList - The list of valid words
 * @returns {boolean} True if word exists in list
 */
export const isWordInList = (word, wordList) => {
  return wordList.includes(word.toUpperCase());
};

/**
 * Calculate letter states for a guess against the solution
 * @param {string} guess - The guessed word
 * @param {string} solution - The solution word
 * @returns {Object[]} Array of letter state objects
 */
export const calculateLetterStates = (guess, solution) => {
  const guessArray = guess.split('');
  const solutionArray = solution.split('');
  const result = [];

  // Track which letters in solution have been matched
  const solutionUsed = new Array(WORD_LENGTH).fill(false);

  // First pass: mark correct letters (green)
  guessArray.forEach((letter, i) => {
    if (letter === solutionArray[i]) {
      result[i] = {
        letter,
        state: LETTER_STATES.CORRECT,
      };
      solutionUsed[i] = true;
    } else {
      result[i] = {
        letter,
        state: LETTER_STATES.ABSENT, // temporary, will update in second pass
      };
    }
  });

  // Second pass: mark present letters (yellow)
  guessArray.forEach((letter, i) => {
    if (result[i].state === LETTER_STATES.CORRECT) {
      return; // already marked as correct
    }

    const indexInSolution = solutionArray.findIndex(
      (solutionLetter, j) => solutionLetter === letter && !solutionUsed[j]
    );

    if (indexInSolution !== -1) {
      result[i].state = LETTER_STATES.PRESENT;
      solutionUsed[indexInSolution] = true;
    }
  });

  return result;
};

/**
 * Calculate keyboard key states based on all guesses
 * @param {string[][]} board - The game board (2D array of letters)
 * @param {string} solution - The solution word
 * @param {number} currentAttempt - Current attempt number
 * @returns {Object} Object with key states {letter: state}
 */
export const calculateKeyStates = (board, solution, currentAttempt) => {
  const keyStates = {};

  // Go through all submitted rows
  for (let i = 0; i < currentAttempt; i++) {
    const guess = board[i].join('');
    const letterStates = calculateLetterStates(guess, solution);

    letterStates.forEach(({ letter, state }) => {
      // Priority: correct > present > absent
      // Don't downgrade a key's state
      if (
        !keyStates[letter] ||
        (state === LETTER_STATES.CORRECT && keyStates[letter] !== LETTER_STATES.CORRECT) ||
        (state === LETTER_STATES.PRESENT && keyStates[letter] === LETTER_STATES.ABSENT)
      ) {
        keyStates[letter] = state;
      }
    });
  }

  return keyStates;
};

/**
 * Check if the game is won
 * @param {string} guess - The guessed word
 * @param {string} solution - The solution word
 * @returns {boolean} True if won
 */
export const isGameWon = (guess, solution) => {
  return guess.toUpperCase() === solution.toUpperCase();
};
