import { Game, User, Word, Round } from "../types";
export { default as generateGameId } from "./generateGameId";
export { default as getUserWords } from "./getUserWords";
export { default as userStillHasWordsToWrite } from "./userStillHasWordsToWrite";
export { default as randomIntFromInterval } from "./randomIntFromInterval";
export { default as getNewWord } from "./getNewWord";

export const calculateCumulativeScore = (rounds: Array<Round>) => {
  return rounds.reduce((acc: any, r) => {
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
};
