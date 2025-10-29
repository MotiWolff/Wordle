import React, { useCallback, useEffect, useContext, useMemo } from "react";
import Key from "./Key";
import { AppContext } from "../contexts/AppContext";

// On-screen keyboard with physical key support
export default function Keyboard() {
  const keys1 = useMemo(
    () => ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    []
  );
  const keys2 = useMemo(
    () => ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    []
  );
  const keys3 = useMemo(() => ["Z", "X", "C", "V", "B", "N", "M"], []);
  const { onSelectLetter, onDelete, onEnter, disabledLetters, keyColors } =
    useContext(AppContext);

  // Map physical key presses to actions
  const handleKeyboard = useCallback(
    (event) => {
      const pressed = event.key.toUpperCase();
      if (pressed === "ENTER") {
        onEnter();
        return;
      }
      if (pressed === "BACKSPACE") {
        onDelete();
        return;
      }
      for (const k of keys1) {
        if (pressed === k) {
          onSelectLetter(k);
          return;
        }
      }
      for (const k of keys2) {
        if (pressed === k) {
          onSelectLetter(k);
          return;
        }
      }
      for (const k of keys3) {
        if (pressed === k) {
          onSelectLetter(k);
          return;
        }
      }
    },
    [onEnter, onDelete, onSelectLetter, keys1, keys2, keys3]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyboard);
    return () => {
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [handleKeyboard]);

  return (
    <div className="keyboard">
      <div className="line1">
        {keys1.map((key) => {
          return (
            <Key
              key={key}
              keyVal={key}
              disabled={disabledLetters.includes(key)}
              status={keyColors[key]}
            />
          );
        })}
      </div>
      <div className="line2">
        {keys2.map((key) => {
          return (
            <Key
              key={key}
              keyVal={key}
              disabled={disabledLetters.includes(key)}
              status={keyColors[key]}
            />
          );
        })}
      </div>
      <div className="line3">
        <Key keyVal={"ENTER"} bigKey disabled={false} />
        {keys3.map((key) => {
          return (
            <Key
              key={key}
              keyVal={key}
              disabled={disabledLetters.includes(key)}
              status={keyColors[key]}
            />
          );
        })}
        <Key keyVal={"⌫"} bigKey deleteKey disabled={false} />
      </div>
    </div>
  );
}
