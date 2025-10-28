import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { useMemo, useState, useCallback, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { boardDefault, generateWordSet } from "./services/Words";
import { AppContext } from "./contexts/AppContext";

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });
  const [wordSet, setWordSet] = useState(new Set());
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "warning",
  });
  const [disabledLetters, setDisabledLetters] = useState([]);

  const correctWord = "RIGHT";

  useEffect(() => {
    generateWordSet().then((words) => {
      setWordSet(words.wordSet);
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
      setToast({
        open: true,
        message: "Not in word list",
        severity: "warning",
      });
    }

    if (currWord === correctWord) {
      setToast({
        open: true,
        message: "You guessed right!",
        severity: "success",
      });
    }
  }, [currAttempt, board, wordSet]);

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
    }),
    [board, currAttempt, onDelete, onSelectLetter, onEnter, correctWord]
  );

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider value={contextValue}>
        <div className="game">
          <Board />
          <Keyboard />
        </div>
        <Snackbar
          open={toast.open}
          autoHideDuration={1500}
          onClose={() =>
            setToast({ open: false, message: "", severity: toast.severity })
          }
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            elevation={0}
            variant="standard"
            severity={toast.severity}
            onClose={() =>
              setToast({ open: false, message: "", severity: toast.severity })
            }
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
