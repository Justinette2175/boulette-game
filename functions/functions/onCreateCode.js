const functions = require("firebase-functions");

const { db } = require("../admin");

const onCreateCode = functions.firestore
  .document("codes/{codeId}")
  .onCreate(async (snapshot, context) => {
    const code = context.params.codeId;
    const codeData = snapshot.data();
    return db
      .collection("mail")
      .add({
        to: [codeData.email],
        message: {
          subject: "Your boulette.ca code",
          html:
            "Thanks for buying a boulette game code. Your code is:" +
            code +
            ". It can be used for " +
            codeData.numberOfPlays +
            "games. Have a nice day!",
        },
      })
      .then(() => console.log("Queued email for delivery!"));
  });

module.exports = onCreateCode;
