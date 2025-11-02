import React, { useCallback, useEffect, useContext, useMemo } from "react";
import Key from "./Key";
import { AppContext } from "../contexts/AppContext";

// On-screen keyboard with physical key support
export default function Keyboard() {
  const {
    onSelectLetter,
    onDelete,
    onEnter,
    disabledLetters,
    keyColors,
    language,
  } = useContext(AppContext);

  // English keyboard layout
  const englishKeys1 = useMemo(
    () => ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    []
  );
  const englishKeys2 = useMemo(
    () => ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    []
  );
  const englishKeys3 = useMemo(() => ["Z", "X", "C", "V", "B", "N", "M"], []);

  // Hebrew keyboard layout (matching standard Hebrew keyboard)
  const hebrewKeys1 = useMemo(() => ["ק", "ר", "א", "ט", "ו", "י", "פ"], []);
  const hebrewKeys2 = useMemo(
    () => ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל"],
    []
  );
  const hebrewKeys3 = useMemo(
    () => ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת"],
    []
  );

  // Select keys based on language
  const keys1 = language === "hebrew" ? hebrewKeys1 : englishKeys1;
  const keys2 = language === "hebrew" ? hebrewKeys2 : englishKeys2;
  const keys3 = language === "hebrew" ? hebrewKeys3 : englishKeys3;

  // Map physical key presses to actions
  const handleKeyboard = useCallback(
    (event) => {
      const key = event.key;
      const pressed = language === "hebrew" ? key : key.toUpperCase();

      if (key === "Enter") {
        onEnter();
        return;
      }
      if (key === "Backspace") {
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
    [onEnter, onDelete, onSelectLetter, keys1, keys2, keys3, language]
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
