const functions = require("firebase-functions");

const { db } = require("../admin");

const rounds = require("../utils/rounds");

const handleStartPlaying = async (ref) => {
  return db.runTransaction(async (transaction) => {
    const team1 = await transaction.get(ref.collection("teams").doc("1"));
    let currentPlayer = null;
    if (team1.exists) {
      const team1Data = team1.data();
      if (team1Data.players) {
        currentPlayer = Object.values(team1Data.players)[0];
      }
    }
    await transaction.update(ref, {
      currentRound: "1",
    });
    await transaction.update(ref.collection("rounds").doc("1"), {
      currentPlayer,
      currentTeam: { id: "1", name: team1.data().name || null },
    });
  });
};

const handleSelectedWords = async (ref) => {
  const wordsSnapshot = await ref.collection("words").get();
  const gameSnapshot = await ref.get();
  const words = {};
  wordsSnapshot.forEach((snap, i) => {
    words[snap.id] = { ...snap.data(), id: snap.id, found: false };
  });
  const batch = db.batch();
  rounds.forEach((r) => {
    batch.update(ref.collection("rounds").doc(r.id), {
      wordsLeft: words,
      score: {
        "1": 0,
        "2": 0,
      },
      secondsPerTurn: gameSnapshot.data().secondsPerTurn,
    });
  });
  await batch.commit();
};

const handleStageChange = async (newStage, ref) => {
  if (newStage === "PLAYING") {
    return await handleStartPlaying(ref);
  }
  if (newStage === "REVIEWING_TEAMS") {
    return await handleSelectedWords(ref);
  }
};

const onUpdateGame = functions.firestore
  .document("games/{gameId}")
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const oldValue = change.before.data();
    if (newValue.stage !== oldValue.stage) {
      await handleStageChange(newValue.stage, change.after.ref);
    }
  });

module.exports = onUpdateGame;
