import { useState, useCallback, useEffect } from "react";
import { boardDefault, generateWordSet } from "../services/Words";

export const useWordle = () => {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [correctWord, setCorrectWord] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
  });

  // Statistics state - load from localStorage
  const [statistics, setStatistics] = useState(() => {
    const saved = localStorage.getItem('wordleStats');
    return saved ? JSON.parse(saved) : {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
    };
  });

  // Load initial word set
  useEffect(() => {
    generateWordSet()
      .then((words) => {
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord.toUpperCase());
      })
      .catch((error) => {
        console.error("Failed to load word list:", error);
        setToast({
          open: true,
          message: "Failed to load word list. Please refresh the page.",
        });
      });
  }, []);

  const onSelectLetter = useCallback(
    (keyVal) => {
      if (gameOver.gameOver) return;
      if (currAttempt.letterPos > 4) return;
      const newBoard = board.map((row) => [...row]);
      newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos + 1,
      });
    },
    [board, currAttempt, gameOver]
  );

  const onDelete = useCallback(() => {
    if (gameOver.gameOver) return;
    if (currAttempt.letterPos === 0) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setCurrAttempt({
      ...currAttempt,
      letterPos: currAttempt.letterPos - 1,
    });
  }, [board, currAttempt, gameOver]);

  const onEnter = useCallback(() => {
    if (gameOver.gameOver) return;
    if (currAttempt.letterPos !== 5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      // Advance the attempt so the submitted row reveals colors
      const nextAttempt = { attempt: currAttempt.attempt + 1, letterPos: 0 };
      if (currWord === correctWord) {
        setCurrAttempt(nextAttempt);
        setGameOver({ gameOver: true, guessedWord: true });

        // Update statistics for a win
        setStatistics((prev) => {
          const newStats = {
            gamesPlayed: prev.gamesPlayed + 1,
            gamesWon: prev.gamesWon + 1,
            currentStreak: prev.currentStreak + 1,
            maxStreak: Math.max(prev.maxStreak, prev.currentStreak + 1),
          };
          localStorage.setItem('wordleStats', JSON.stringify(newStats));
          return newStats;
        });
        return;
      }

      if (currAttempt.attempt === 5) {
        setCurrAttempt(nextAttempt);
        setGameOver({ gameOver: true, guessedWord: false });

        // Update statistics for a loss
        setStatistics((prev) => {
          const newStats = {
            gamesPlayed: prev.gamesPlayed + 1,
            gamesWon: prev.gamesWon,
            currentStreak: 0,
            maxStreak: prev.maxStreak,
          };
          localStorage.setItem('wordleStats', JSON.stringify(newStats));
          return newStats;
        });
        return;
      }

      setCurrAttempt(nextAttempt);
    } else {
      setToast({ open: true, message: "Not in word list" });
    }
  }, [currAttempt, board, wordSet, correctWord, gameOver]);

  const onRestart = useCallback(() => {
    setBoard(boardDefault);
    setCurrAttempt({ attempt: 0, letterPos: 0 });
    setDisabledLetters([]);
    setGameOver({ gameOver: false, guessedWord: false });

    generateWordSet()
      .then((words) => {
        setWordSet(words.wordSet);
        setCorrectWord(words.todaysWord.toUpperCase());
      })
      .catch((error) => {
        console.error("Failed to load word list:", error);
        setToast({
          open: true,
          message: "Failed to load word list. Please refresh the page.",
        });
      });
  }, []);

  return {
    board,
    setBoard,
    currAttempt,
    setCurrAttempt,
    wordSet,
    disabledLetters,
    setDisabledLetters,
    gameOver,
    setGameOver,
    correctWord,
    toast,
    setToast,
    onSelectLetter,
    onDelete,
    onEnter,
    onRestart,
    statistics,
  };
};
