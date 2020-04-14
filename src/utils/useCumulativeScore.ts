import React from "react";
import { useSelector } from "react-redux";
import { Store, RoundScore } from "../types";

export default (): RoundScore => {
  const cumulativeSore: RoundScore = useSelector((state: Store) => {
    return state.game.rounds.reduce((acc: any, r) => {
      if (r.score) {
        Object.keys(r.score).forEach((teamId) => {
          if (acc[teamId]) {
            acc[teamId] += r.score[teamId];
          } else {
            acc[teamId] = r.score[teamId];
          }
        });
      }
      return acc;
    }, {});
  });
  return cumulativeSore;
};
