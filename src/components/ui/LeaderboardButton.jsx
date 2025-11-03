import { useState, useRef, useEffect } from "react";
import Leaderboard from "./Leaderboard";

export default function LeaderboardButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="leaderboard-container" ref={containerRef}>
      <button
        className="icon-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View leaderboard"
      >
        <img src="/leaderboard.svg" alt="Leaderboard" />
      </button>
      {isOpen && <Leaderboard onClose={() => setIsOpen(false)} />}
    </div>
  );
}
