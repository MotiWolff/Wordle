import BackspaceIcon from "@mui/icons-material/Backspace";
import { AppContext } from "../contexts/AppContext";
import { useContext } from "react";

export default function Key({ keyVal, bigKey, deleteKey, disabled }) {
  const id = bigKey ? "big" : undefined;
  const className = `key${deleteKey ? " delete" : ""}`;
  const { onSelectLetter, onDelete, onEnter } = useContext(AppContext);

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
      id={id ? "big" : disabled ? "disabled" : undefined}
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
