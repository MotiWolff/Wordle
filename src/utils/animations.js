import {
  FLIP_ANIMATION_DELAY,
  FLIP_DURATION,
  COLOR_REVEAL_DELAY,
  WORD_LENGTH,
} from '@constants/gameConstants';

/**
 * Calculate the delay before starting animations for a letter
 * @param {number} letterIndex - Index of the letter in the word (0-4)
 * @returns {number} Delay in milliseconds
 */
export const getLetterAnimationDelay = letterIndex => {
  return letterIndex * FLIP_ANIMATION_DELAY;
};

/**
 * Calculate the delay before revealing color for a letter
 * @param {number} letterIndex - Index of the letter in the word (0-4)
 * @returns {number} Delay in milliseconds
 */
export const getColorRevealDelay = letterIndex => {
  return letterIndex * FLIP_ANIMATION_DELAY + COLOR_REVEAL_DELAY;
};

/**
 * Calculate total time for row animation to complete
 * @returns {number} Total duration in milliseconds
 */
export const getTotalRowAnimationTime = () => {
  return (WORD_LENGTH - 1) * FLIP_ANIMATION_DELAY + FLIP_DURATION;
};

/**
 * Delay execution using Promise
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
export const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
