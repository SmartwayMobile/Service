var admin = require("firebase-admin");

var serviceAccount = require("./smartway-mobile-1512405241266-firebase-adminsdk-7df7n-30c5543ee3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartway-mobile-1512405241266.firebaseio.com"
});