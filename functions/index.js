const functions = require("firebase-functions");

const onCreateGame = require("./functions/onCreateGame");
const onUpdateGame = require("./functions/onUpdateGame");
const generateTwillioToken = require("./functions/generateTwillioToken");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.onUpdateGame = onUpdateGame;
exports.onCreateGame = onCreateGame;

exports.generateTwillioToken = functions.https.onCall((data, context) => {
  console.log(">>> data", data);
  return generateTwillioToken(data.gameId, data.deviceId);
});
