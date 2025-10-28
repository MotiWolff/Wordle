import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { useMemo } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { AppContext } from "./contexts/AppContext";
import GameOver from "./components/GameOver";
import { useWordle } from "./hooks/useWordle";

function App() {
  const {
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
  } = useWordle();

  const contextValue = useMemo(
    () => ({
      board,
      setBoard,
      currAttempt,
      setCurrAttempt,
      onDelete,
      onSelectLetter,
      onEnter,
      onRestart,
      correctWord,
      setDisabledLetters,
      disabledLetters,
      gameOver,
      setGameOver,
      statistics,
    }),
    [
      board,
      setBoard,
      currAttempt,
      setCurrAttempt,
      onDelete,
      onSelectLetter,
      onEnter,
      onRestart,
      correctWord,
      setDisabledLetters,
      disabledLetters,
      gameOver,
      setGameOver,
      statistics,
    ]
  );

  return (
    <div className="App">
      <nav>
        <h1>Wordle</h1>
      </nav>
      <AppContext.Provider value={contextValue}>
        {wordSet.size === 0 ? (
          <div className="game">
            <div
              style={{ textAlign: "center", marginTop: "2rem", color: "#fff" }}
            >
              Loading...
            </div>
          </div>
        ) : (
            <div className="game">
              <Board />
              {gameOver.gameOver ? <GameOver /> : <Keyboard />}
            </div>
        )}
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
