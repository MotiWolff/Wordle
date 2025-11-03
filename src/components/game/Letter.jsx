import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '@contexts/AppContext';
import {
  getLetterAnimationDelay,
  getColorRevealDelay,
} from '@utils/animations';

// A single tile on the board
export default function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt, setDisabledLetters, language } =
    useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  const [flip, setFlip] = useState(false);
  const [revealColor, setRevealColor] = useState(false);

  // For Hebrew, compare with reversed position since board is RTL but correctWord is LTR
  const correctWordIndex = language === "hebrew" ? 4 - letterPos : letterPos;
  const correct = correctWord[correctWordIndex] === letter;
  const almost = !correct && letter !== "" && correctWord.includes(letter);

  const letterState =
    currAttempt.attempt > attemptVal && revealColor
      ? correct
        ? "correct"
        : almost
          ? "almost"
          : "error"
      : undefined;

  useEffect(() => {
    // Only update disabled letters after this row has been submitted
    if (currAttempt.attempt <= attemptVal) return;
    if (letter === "") return;
    if (correct || almost) return;

    setDisabledLetters((prev) =>
      prev.includes(letter) ? prev : [...prev, letter]
    );
  }, [
    currAttempt.attempt,
    attemptVal,
    letter,
    correct,
    almost,
    setDisabledLetters,
  ]);

  // Trigger flip animation when row is submitted
  useEffect(() => {
    if (currAttempt.attempt === attemptVal + 1 && letter !== "") {
      // For Hebrew, flip from right to left (reverse the delay)
      const animationPos = language === "hebrew" ? 4 - letterPos : letterPos;

      const flipTimer = setTimeout(() => {
        setFlip(true);
      }, getLetterAnimationDelay(animationPos));

      // Reveal color at 50% of flip animation
      const colorTimer = setTimeout(() => {
        setRevealColor(true);
      }, getColorRevealDelay(animationPos));

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(colorTimer);
      };
    }
  }, [currAttempt.attempt, attemptVal, letterPos, letter, language]);

  return (
    <div className={`letter ${flip ? "flip" : ""}`} id={letterState}>
      {letter}
    </div>
  );
}

Letter.propTypes = {
  letterPos: PropTypes.number.isRequired,
  attemptVal: PropTypes.number.isRequired,
};
