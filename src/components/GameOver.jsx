import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

export default function GameOver() {
  const { gameOver, currAttempt, correctWord } = useContext(AppContext);
  return (
    <div className="gameOver">
      <h3>{gameOver.guessedWord ? "You correctly guessed" : "You failed"}</h3>
      <h1>Correct: {correctWord} </h1>
      {gameOver.guessedWord && (
        <h3>You guessed in {currAttempt.attempt} attempts</h3>
      )}
    </div>
  );
}
