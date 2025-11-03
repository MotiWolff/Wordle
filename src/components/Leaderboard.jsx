import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import "./Leaderboard.css";

export default function Leaderboard() {
  const { statistics } = useContext(AppContext);

  const winPercentage =
    statistics.gamesPlayed > 0
      ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
      : 0;

  const maxDistribution = statistics.guessDistribution
    ? Math.max(...Object.values(statistics.guessDistribution))
    : 0;

  return (
    <div className="leaderboard-dropdown">
      <div className="leaderboard-header">
        <h2>Statistics</h2>
      </div>

      <div className="leaderboard-content">
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

        <div className="guess-distribution">
          <h3 className="section-title">Guess Distribution</h3>
          {statistics.guessDistribution &&
          Object.keys(statistics.guessDistribution).length > 0 ? (
            <div className="distribution-chart">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const count = statistics.guessDistribution[num] || 0;
                const percentage =
                  maxDistribution > 0 ? (count / maxDistribution) * 100 : 0;
                return (
                  <div key={num} className="distribution-row">
                    <span className="distribution-label">{num}</span>
                    <div className="distribution-bar-container">
                      <div
                        className="distribution-bar"
                        style={{ width: `${Math.max(percentage, count > 0 ? 7 : 0)}%` }}
                      >
                        <span className="distribution-count">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-data">No games played yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
