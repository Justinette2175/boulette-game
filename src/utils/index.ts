import { Game, User, Word, Round } from "../types";
import { WORDS_PER_PLAYER } from "../constants";

export const getUserWords = (words: Array<Word>, u: User) =>
  u ? words.filter((w) => w.writtenBy === u.id) || [] : [];

export const userStillHasWordsToWrite = (
  words: Array<Word>,
  u: User
): Array<any> => {
  const userWords = getUserWords(words, u);
  return [userWords.length < WORDS_PER_PLAYER, userWords];
};

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
