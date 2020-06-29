const functions = require("firebase-functions");
const moment = require("moment");

const { db } = require("../admin");

const startTurn = functions.https.onCall(async (data, context) => {
  if (data.gameId && data.roundId) {
    return db.runTransaction(async (transaction) => {
      const ref = db
        .collection("games")
        .doc(data.gameId)
        .collection("rounds")
        .doc(data.roundId);
      const roundSnap = await transaction.get(ref);
      const round = roundSnap.data();
      const { remainingTimeFromPreviousRound, secondsPerTurn } = round;

      // Set endOfCurrentTurn
      const msLengthOfTurn = remainingTimeFromPreviousRound
        ? moment.duration(remainingTimeFromPreviousRound)
        : moment.duration(secondsPerTurn * 1000);

      const endOfCurrentTurn = moment().add(msLengthOfTurn).unix();

      await transaction.update(ref, { endOfCurrentTurn });
    });
  }
});

module.exports = startTurn;
