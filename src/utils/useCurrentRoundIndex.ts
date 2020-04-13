import React from "react";
import { useSelector } from "react-redux";
import { Store, Round } from "../types";

export default (): number => {
  const currentRoundIndex: number = useSelector((state: Store) => {
    if (state.game.currentRound) {
      const round: Round = state.game.rounds.find(
        (r) => r.id === state.game.currentRound
      );
      return round ? round.index : null;
    }
    return null;
  });
  return currentRoundIndex;
};
