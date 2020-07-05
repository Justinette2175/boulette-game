const functions = require("firebase-functions");

const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const generateTwillioToken = (gameId, deviceId) => {
  functions.logger.log("Config", functions.config());
  const ACCOUNT_SID = functions.config().twillio["account-sid"];
  const API_KEY_SID = functions.config().twillio.sid;
  const API_KEY_SECRET = functions.config().twillio.secret;

  const accessToken = new AccessToken(ACCOUNT_SID, API_KEY_SID, API_KEY_SECRET);

  accessToken.identity = deviceId;

  const grant = new VideoGrant();
  grant.room = gameId;
  accessToken.addGrant(grant);

  return accessToken.toJwt();
};

module.exports = generateTwillioToken;
