import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

export default function Letter({ letterPos, attemptVal }) {
  const { board, correctWord, currAttempt } = useContext(AppContext);
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
  return (
    <div className="letter" id={letterState}>
      {letter}
    </div>
  );
}
