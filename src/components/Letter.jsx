import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../contexts/AppContext";

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
      const flipTimer = setTimeout(() => {
        setFlip(true);
      }, letterPos * 250); // Stagger each letter by 250ms

      // Reveal color at 50% of flip animation (400ms after flip starts)
      const colorTimer = setTimeout(() => {
        setRevealColor(true);
      }, letterPos * 250 + 400);

      return () => {
        clearTimeout(flipTimer);
        clearTimeout(colorTimer);
      };
    }
  }, [currAttempt.attempt, attemptVal, letterPos, letter]);

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
