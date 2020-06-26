import { FirebasePlayer, FirebaseGameWord } from "../types/firebaseTypes";
import getUserWords from "./getUserWords";

const userStillHasWordsToWrite = (
  words: Array<FirebaseGameWord>,
  u: FirebasePlayer,
  wordsPerPlayer: number
): Array<any> => {
  const userWords = getUserWords(words, u);
  return [userWords.length < wordsPerPlayer, userWords];
};

export default userStillHasWordsToWrite;
