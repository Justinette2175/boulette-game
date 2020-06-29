const functions = require("firebase-functions");
const getNewWord = require("../utils/getNewWord");
const rounds = require("../utils/rounds");

const { db } = require("../admin");

const handleWordFound = functions.https.onCall(async (data, context) => {
  if (data.gameId && data.roundId && data.wordFoundId) {
    return db.runTransaction(async (transaction) => {
      const ref = db.collection("games").doc(data.gameId);

      // Get new word
      const roundSnap = await transaction.get(
        ref.collection("rounds").doc(data.roundId)
      );
      const round = roundSnap.data();
      const { wordsLeft, currentPlayer, currentTeam } = round;
      const newWord = getNewWord(wordsLeft);

      // Set currentWord, update wordsLeft, and update score
      await transaction.update(ref.collection("rounds").doc(data.roundId), {
        [`score.${currentTeam.id}`]: db.FieldValue.increment(1),
        currentWord: newWord,
        [`wordsLeft.${data.wordFoundId}`]: null,
      });

      if (!newWord) {
        // Get next round
        const nextRoundId = (parseInt(roundId) + 1).toString();
        const nextRoundExists = rounds.find((r) => r.id === nextRoundId);
        if (nextRoundExists) {
          // Start next round
          const nextRoundSnap = transaction.get(
            ref.collection("rounds").doc(nextRoundId)
          );
          const { wordsLeft: nextRoundWordsLeft } = nextRoundSnap.data();
          const nextRoundNewWord = getNewWord(nextRoundWordsLeft);
          await transaction.update(ref, {
            currentRound: nextRoundId,
          });
          await transaction.update(ref.collection("rounds").doc(nextRoundId), {
            currentPlayer,
            currentTeam,
            currentWord: nextRoundNewWord,
            remainingTimeFromPreviousRound: data.remainingTime || 0,
          });
        } else {
          // Finish game
        }
      }
    });
  }
});

module.exports = handleWordFound;
