import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../contexts/AppContext";

export default function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt, setDisabledLetters } =
    useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  const [flip, setFlip] = useState(false);

  const correct = correctWord[letterPos] === letter;
  const almost = !correct && letter !== "" && correctWord.includes(letter);

  const letterState =
    currAttempt.attempt > attemptVal
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

    setDisabledLetters((prev) => (prev.includes(letter) ? prev : [...prev, letter]));
  }, [currAttempt.attempt, attemptVal, letter, correct, almost, setDisabledLetters]);

  // Trigger flip animation when row is submitted
  useEffect(() => {
    if (currAttempt.attempt === attemptVal + 1 && letter !== "") {
      const timer = setTimeout(() => {
        setFlip(true);
      }, letterPos * 250); // Stagger each letter by 250ms

      return () => clearTimeout(timer);
    }
  }, [currAttempt.attempt, attemptVal, letterPos, letter]);

  return (
    <div
      className={`letter ${flip ? 'flip' : ''}`}
      id={letterState}
    >
      {letter}
    </div>
  );
}

Letter.propTypes = {
  letterPos: PropTypes.number.isRequired,
  attemptVal: PropTypes.number.isRequired,
};
