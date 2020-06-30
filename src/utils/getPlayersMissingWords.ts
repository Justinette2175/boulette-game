import { FirebasePlayer, FirebaseGameWord } from "../types/firebaseTypes";

import getUserWords from "./getUserWords";

const getPlayersMissingWords = (
  players: Array<FirebasePlayer>,
  allWords: Array<FirebaseGameWord>,
  wordsPerPlayer: number
): Array<string> => {
  const playerNamesMissingWords: Array<string> = [];
  players.forEach((p) => {
    const words = getUserWords(allWords, p);
    if (words.length < wordsPerPlayer) {
      playerNamesMissingWords.push(p.name);
    }
  });
  return playerNamesMissingWords;
};

export default getPlayersMissingWords;
