import React, { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

export default function Letter({ letterPos, attemptVal }) {
  const { board } = useContext(AppContext);
  const letter = board[attemptVal][letterPos];
  return <div className="letter">{letter}</div>;
}
