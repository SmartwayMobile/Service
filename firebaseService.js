var admin = require("firebase-admin");

var serviceAccount = require("./smartway-mobile-1512405241266-firebase-adminsdk-7df7n-30c5543ee3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smartway-mobile-1512405241266.firebaseio.com"
});

exports.getUsers = () => {
  let users = [];
  return new Promise((resolve, reject) => {
    var ref = admin.database().ref("users");

    ref.on('value', (snapshot) => {
      users = Object.keys(snapshot.val()).map(k => {
        const user = snapshot.val()[k];
        user.uuid = k;
        return user;
      });
      resolve(users);
    }, reject);

  });
}