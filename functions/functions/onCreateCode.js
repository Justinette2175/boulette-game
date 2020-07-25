const functions = require("firebase-functions");
const moment = require("moment");

const { db } = require("../admin");

const onCreateCode = functions.firestore
  .document("codes/{codeId}")
  .onCreate(async (snapshot, context) => {
    const code = context.params.codeId;
    const codeData = snapshot.data();
    const date = moment(codeData.createdOn).format("dddd, MMMM Do YYYY");
    return db
      .collection("mail")
      .add({
        to: [codeData.email],
        template: {
          name: "receipt-EN",
          data: {
            email: codeData.email,
            code,
            description: `1x code for ${codeData.numberOfPlays} game(s) of boulette`,
            cost: codeData.cost,
            currency: codeData.currency,
            date,
            paypalId: codeData.paypalTransactionId,
          },
        },
      })
      .then(() => console.log("Queued email for delivery!"));
  });

module.exports = onCreateCode;
