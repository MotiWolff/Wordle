import { useState, useCallback, useEffect } from "react";
import { boardDefault, generateWordSet } from "../services/Words";

// Central game state and logic
export const useWordle = () => {
  const [language, setLanguage] = useState("english");
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [keyColors, setKeyColors] = useState({}); // keyboard letter status
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
    const saved = localStorage.getItem("wordleStats");
    return saved
      ? JSON.parse(saved)
      : {
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          maxStreak: 0,
        };
  });

  // Load word list and pick today's word
  useEffect(() => {
    generateWordSet(language)
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
  }, [language]);

  // Type a letter into the current row
  const onSelectLetter = useCallback(
    (keyVal) => {
      if (gameOver.gameOver) return;
      if (currAttempt.letterPos > 4) return;
      const newBoard = board.map((row) => [...row]);

      // For Hebrew, fill from right to left (position 4 -> 0)
      const actualPos =
        language === "hebrew"
          ? 4 - currAttempt.letterPos
          : currAttempt.letterPos;

      newBoard[currAttempt.attempt][actualPos] = keyVal;
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos + 1,
      });
    },
    [board, currAttempt, gameOver, language]
  );

  // Backspace one letter
  const onDelete = useCallback(() => {
    if (gameOver.gameOver) return;
    if (currAttempt.letterPos === 0) return;
    const newBoard = board.map((row) => [...row]);

    // For Hebrew, delete from right to left
    const actualPos =
      language === "hebrew"
        ? 4 - (currAttempt.letterPos - 1)
        : currAttempt.letterPos - 1;

    newBoard[currAttempt.attempt][actualPos] = "";
    setBoard(newBoard);
    setCurrAttempt({
      ...currAttempt,
      letterPos: currAttempt.letterPos - 1,
    });
  }, [board, currAttempt, gameOver, language]);

  // Submit the row
  const onEnter = useCallback(() => {
    if (gameOver.gameOver) return;
    if (currAttempt.letterPos !== 5) return;

    // Build the word from the board
    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    // For Hebrew, reverse the word to match the actual reading order
    if (language === "hebrew") {
      currWord = currWord.split("").reverse().join("");
    }

    if (wordSet.has(currWord.toLowerCase())) {
      // Update keyboard colors for this guess
      const newKeyColors = { ...keyColors };

      // Compare each character in the actual word (currWord) with correctWord
      for (let i = 0; i < 5; i++) {
        const letter = currWord[i];
        const isCorrect = correctWord[i] === letter;
        const isAlmost = !isCorrect && correctWord.includes(letter);

        // Priority: correct > almost > error
        // Only update if the new status is better than the current one
        if (isCorrect) {
          newKeyColors[letter] = "correct";
        } else if (isAlmost && newKeyColors[letter] !== "correct") {
          newKeyColors[letter] = "almost";
        } else if (!newKeyColors[letter]) {
          newKeyColors[letter] = "error";
        }
      }
      setKeyColors(newKeyColors);

      // Advance so the submitted row reveals colors
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
          localStorage.setItem("wordleStats", JSON.stringify(newStats));
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
          localStorage.setItem("wordleStats", JSON.stringify(newStats));
          return newStats;
        });
        return;
      }

      setCurrAttempt(nextAttempt);
    } else {
      setToast({ open: true, message: "Not in word list" });
    }
  }, [
    gameOver.gameOver,
    currAttempt.letterPos,
    currAttempt.attempt,
    language,
    wordSet,
    board,
    keyColors,
    correctWord,
  ]);

  // Start a new game
  const onRestart = useCallback(
    (newLanguage) => {
      setBoard(boardDefault);
      setCurrAttempt({ attempt: 0, letterPos: 0 });
      setDisabledLetters([]);
      setKeyColors({});
      setGameOver({ gameOver: false, guessedWord: false });

      const langToUse = newLanguage || language;
      if (newLanguage && newLanguage !== language) {
        setLanguage(newLanguage);
      }

      generateWordSet(langToUse)
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
    },
    [language]
  );

  return {
    board,
    setBoard,
    currAttempt,
    setCurrAttempt,
    wordSet,
    disabledLetters,
    setDisabledLetters,
    keyColors,
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
    language,
    setLanguage,
  };
};
