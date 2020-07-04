const functions = require("firebase-functions");

const { db } = require("../admin");

const rounds = require("../utils/rounds");

const onCreateGame = functions.firestore
  .document("games/{gameId}")
  .onCreate(async (snap) => {
    const { owner } = snap.data();
    const batch = db.batch();
    rounds.forEach((r) => {
      batch.set(snap.ref.collection("rounds").doc(r.id), {
        index: r.id,
        score: {
          "1": 0,
          "2": 0,
        },
        wordsLeft: [],
      });
    });
    batch.set(snap.ref.collection("teams").doc("1"), {
      players: {
        [owner.id]: owner,
      },
      captain: owner,
    });
    batch.set(snap.ref.collection("teams").doc("2"), {
      players: {},
    });

    batch.update(snap.ref, {
      score: {
        "1": 0,
        "2": 0,
      },
    });
    await batch.commit();
  });

module.exports = onCreateGame;
