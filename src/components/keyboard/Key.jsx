import BackspaceIcon from "@mui/icons-material/Backspace";
import { AppContext } from "@contexts/AppContext";
import { useContext } from "react";

// Single key (letter/enter/delete)
export default function Key({ keyVal, bigKey, deleteKey, disabled, status }) {
  const id = bigKey
    ? "big"
    : status || (disabled
      ? "disabled"
      : undefined);
  const className = `key${deleteKey ? " delete" : ""}`;
  const { onSelectLetter, onDelete, onEnter } = useContext(AppContext);

  // Route click to the right action
  function selectLetter() {
    if (keyVal === "ENTER") {
      onEnter();
    } else if (deleteKey) {
      onDelete();
    } else {
      onSelectLetter(keyVal);
    }
  }
  return (
    <div
      className={className}
      id={id}
      onClick={selectLetter}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") selectLetter();
      }}
      aria-disabled={!!disabled}
    >
      {deleteKey ? <BackspaceIcon fontSize="inherit" /> : keyVal}
    </div>
  );
}