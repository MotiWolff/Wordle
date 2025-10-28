import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { useMemo, useState, useCallback, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { boardDefault, generateWordSet } from "./services/Words";
import { AppContext } from "./contexts/AppContext";
import GameOver from "./components/GameOver";

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [toast, setToast] = useState({
    open: false,
    message: "",
  });
  const [disabledLetters, setDisabledLetters] = useState([]);
  const [gameOver, setGameOver] = useState({
    gameOver: false,
    guessedWord: false,
  });
  const [correctWord, setCorrectWord] = useState("");

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
      setCorrectWord(words.todaysWord.toUpperCase());
    });
  }, []);

  const onSelectLetter = useCallback(
    (keyVal) => {
      if (currAttempt.letterPos > 4) return;
      const newBoard = [...board];
      newBoard[currAttempt.attempt][currAttempt.letterPos] = keyVal;
      setBoard(newBoard);
      setCurrAttempt({
        ...currAttempt,
        letterPos: currAttempt.letterPos + 1,
      });
    },
    [board, currAttempt]
  );

  const onDelete = useCallback(() => {
    if (currAttempt.letterPos === 0) return;
    const newBoard = [...board];
    newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
    setBoard(newBoard);
    setCurrAttempt({
      ...currAttempt,
      letterPos: currAttempt.letterPos - 1,
    });
  }, [board, currAttempt]);

  const onEnter = useCallback(() => {
    if (currAttempt.letterPos !== 5) return;

    let currWord = "";
    for (let i = 0; i < 5; i++) {
      currWord += board[currAttempt.attempt][i];
    }

    if (wordSet.has(currWord.toLowerCase())) {
      setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    } else {
      setToast({ open: true, message: "Not in word list" });
    }

    if (currWord === correctWord) {
      setGameOver({ gameOver: true, guessedWord: true });
      return;
    }

    if (currAttempt.attempt === 5) {
      setGameOver({ gameOver: true, guessedWord: false });
    }
  }, [currAttempt, board, wordSet, correctWord]);

  const contextValue = useMemo(
    () => ({
      board,
      setBoard,
      currAttempt,
      setCurrAttempt,
      onDelete,
      onSelectLetter,
      onEnter,
      correctWord,
      setDisabledLetters,
      disabledLetters,
      gameOver,
      setGameOver,
    }),
    [
      board,
      currAttempt,
      onDelete,
      onSelectLetter,
      onEnter,
      correctWord,
      setDisabledLetters,
      disabledLetters,
      gameOver,
      setGameOver,
    ]
  );

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider value={contextValue}>
        <div className="game">
          <Board />
          {gameOver.gameOver ? <GameOver /> : <Keyboard />}
        </div>
        <Snackbar
          open={toast.open}
          autoHideDuration={1500}
          onClose={() => setToast({ open: false, message: "" })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            elevation={0}
            variant="standard"
            severity="warning"
            onClose={() => setToast({ open: false, message: "" })}
            sx={{
              fontWeight: 700,
              bgcolor: "#fff",
              color: "#000",
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      </AppContext.Provider>
    </div>
  );
}

export default App;
