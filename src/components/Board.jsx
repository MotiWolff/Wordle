import { useContext } from "react";
import Letter from "./Letter";
import { AppContext } from "../contexts/AppContext";

const MAX_ATTEMPTS = 6; // rows
const WORD_LENGTH = 5; // cols

// Grid of tiles (6x5)
export default function Board() {
  const { language } = useContext(AppContext);

  return (
    <div className="board">
      {Array.from({ length: MAX_ATTEMPTS }).map((_, attemptVal) => (
        <div
          className={`row ${language === "hebrew" ? "rtl" : ""}`}
          key={attemptVal}
        >
          {Array.from({ length: WORD_LENGTH }).map((_, letterPos) => (
            <Letter
              key={letterPos}
              attemptVal={attemptVal}
              letterPos={letterPos}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
