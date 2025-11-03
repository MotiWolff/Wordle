import React, { useCallback, useEffect, useContext } from 'react';
import Key from './Key';
import { AppContext } from '@contexts/AppContext';
import { getKeyboardLayout } from '@constants/keyboardLayouts';

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

  // Get keyboard layout based on language
  const layout = getKeyboardLayout(language);
  const keys1 = layout.row1;
  const keys2 = layout.row2;
  const keys3 = layout.row3;

  // Map physical key presses to actions
  const handleKeyboard = useCallback(
    (event) => {
      const key = event.key;
      const pressed = language === 'hebrew' ? key : key.toUpperCase();

      if (key === 'Enter') {
        event.preventDefault(); // Prevent page reload
        onEnter();
        return;
      }
      if (key === 'Backspace') {
        event.preventDefault(); // Prevent browser back navigation
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
