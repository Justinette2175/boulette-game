import React from "react";
import { useSelector } from "react-redux";
import { Store, RoundScore, Round } from "../types";

export default (): RoundScore => {
  const roundScore: RoundScore = useSelector((state: Store) => {
    if (state.game.currentRound) {
      const round: Round = state.game.rounds.find(
        (r) => r.id === state.game.currentRound
      );
      return round ? round.score : null;
    }
    return null;
  });
  return roundScore;
};
