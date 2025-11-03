import { useContext } from "react";
import { AppContext } from "@contexts/AppContext";

// End screen showing result and stats snippet
export default function GameOver() {
  const { gameOver, currAttempt, correctWord, onRestart, statistics } = useContext(AppContext);

  const winPercentage = statistics.gamesPlayed > 0
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;

  return (
    <div className="gameOver">
      <div className="gameOver-content">
        <div className="gameOver-icon">
          {gameOver.guessedWord ? (
            <img src="/wordle-green-star.svg" alt="Success" className="gameOver-icon-img" />
          ) : (
            "❌"
          )}
        </div>

        <h2 className="gameOver-title">
          {gameOver.guessedWord ? "Congratulations!" : "Game Over"}
        </h2>

        {gameOver.guessedWord ? (
          <p className="gameOver-subtitle">
            You solved it in {currAttempt.attempt} {currAttempt.attempt === 1 ? 'guess' : 'guesses'}.
          </p>
        ) : (
          <p className="gameOver-subtitle">
            The word was: <strong>{correctWord}</strong>
          </p>
        )}

        <div className="statistics">
          <h3 className="statistics-title">STATISTICS</h3>
          <div className="statistics-grid">
            <div className="stat-item">
              <div className="stat-value">{statistics.gamesPlayed}</div>
              <div className="stat-label">Played</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{winPercentage}</div>
              <div className="stat-label">Win %</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{statistics.currentStreak}</div>
              <div className="stat-label">Current Streak</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{statistics.maxStreak}</div>
              <div className="stat-label">Max Streak</div>
            </div>
          </div>
        </div>

        <button className="restart-btn" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}
