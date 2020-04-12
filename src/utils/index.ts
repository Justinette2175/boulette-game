import { Game, User, Word } from "../types";
import { WORDS_PER_PLAYER } from "../constants";

export const getUserWords = (words: Array<Word>, u: User) =>
  u ? words.filter((w) => w.writtenBy === u.id) || [] : [];

export const userStillHasWordsToWrite = (words: Array<Word>, u: User) => {
  const userWords = getUserWords(words, u);
  return userWords.length < WORDS_PER_PLAYER;
};
