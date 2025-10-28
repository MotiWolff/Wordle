import "./App.css";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import { useMemo, useState, useCallback } from "react";
import { boardDefault } from "./services/Words";
import { AppContext } from "./contexts/AppContext";

function App() {
  const [board, setBoard] = useState(boardDefault);
  const [currAttempt, setCurrAttempt] = useState({ attempt: 0, letterPos: 0 });

  const correctWord = "RIGHT";

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
    setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
  }, [currAttempt]);

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
      </AppContext.Provider>
    </div>
  );
}

export default App;
