import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../contexts/AppContext";

export default function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt, setDisabledLetters } =
    useContext(AppContext);
  const letter = board[attemptVal][letterPos];

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

  return (
    <div className="letter" id={letterState}>
      {letter}
    </div>
  );
}

Letter.propTypes = {
  letterPos: PropTypes.number.isRequired,
  attemptVal: PropTypes.number.isRequired,
};
