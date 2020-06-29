const functions = require("firebase-functions");
const getNewWord = require("../utils/getNewWord");

const { db } = require("../admin");

const getNewPlayer = (players, currentPlayer) => {
  const playerValues = Object.values(players).sort(
    (a, b) => a.createdAt - b.createdAt
  );
  const indexOfCurrentPlayer = currentPlayer
    ? playerValues.findIndex((p) => p.id === currentPlayer.id)
    : playerValues.length - 1;

  const newPlayerIndex =
    indexOfCurrentPlayer + 1 >= playerValues.length
      ? 0
      : indexOfCurrentPlayer + 1;

  return playerValues[newPlayerIndex];
};

const endTurn = functions.https.onCall(async (data, context) => {
  if (data.gameId && data.roundId) {
    return db.runTransaction(async (transaction) => {
      const ref = db.collection("games").doc(data.gameId);
      const roundSnap = await transaction.get(
        ref.collection("rounds").doc(data.roundId)
      );
      const round = roundSnap.data();
      const { currentTeam, wordsLeft, currentPlayer } = round;
      const newTeamId = !currentTeam || currentTeam.id === "2" ? "1" : "2";
      const newTeamSnap = await transaction.get(
        ref.collection("teams").doc(newTeamId)
      );
      const newTeam = newTeamSnap.data();
      const newPlayer = getNewPlayer(newTeam.players, currentPlayer);
      const newWord = getNewWord(wordsLeft);

      await transaction.update(ref.collection("rounds").doc(data.roundId), {
        endOfCurrentTurn: null,
        currentPlayer: newPlayer,
        currentTeam: newTeam,
        currentWord: newWord,
      });
    });
  }
});

module.exports = endTurn;
