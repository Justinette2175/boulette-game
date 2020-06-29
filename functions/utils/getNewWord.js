const randomIntFromInterval = require("./randomIntFromInterval");

const getNewWord = (wordsLeft) => {
  const words = Object.values(wordsLeft).filter((w) => Boolean(w));
  if (words.length > 0) {
    const randomIndex = randomIntFromInterval(0, words.length - 1);
    return words[randomIndex];
  } else {
    return null;
  }
};

module.exports = getNewWord;
