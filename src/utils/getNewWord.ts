import randomIntFromInterval from "./randomIntFromInterval";
import { RoundWord } from "../types/firebaseTypes";

const getNewWord = (wordsLeft: { [key: string]: RoundWord }) => {
  const words = Object.values(wordsLeft).filter((w) => !w.foundBy);
  if (words.length > 0) {
    const randomIndex = randomIntFromInterval(0, words.length - 1);
    return words[randomIndex];
  } else {
    return null;
  }
};

export default getNewWord;
