var admin = require("firebase-admin");
var fs = require('fs');
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

exports.getIncidents = () => {
  let incidents = [];
  return new Promise((resolve, reject) => {
    var ref = admin.database().ref("incidents");

    ref.on('value', (snapshot) => {
      incidents = Object.keys(snapshot.val()).map(k => {
        const incident = snapshot.val()[k];
        incident.uuid = k;
        return incident;
      });
      resolve(incidents);
    }, reject);

  });
}

exports.sendMessage = (message) => {
  // This registration token comes from the client FCM SDKs.
  var registrationToken = "dNEOCU68kuw:APA91bFn-Ktsot_I12qFOw_4732_bTxwCzsnUr26v898fS8fRyUrH5tbLV067x44Wyg-OSB3T-zAzv71cusbr8xTPkYjqia7GhYLwGFxz5awx__1GZjdiq_OdtsmYBVaseVLV2zBBEbM";

  // See the "Defining the message payload" section below for details
  // on how to define a message payload.
  var payload = {
    data: { msg: message }
  };

  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().sendToDevice(registrationToken, payload)
    .then(function (response) {
      // See the MessagingDevicesResponse reference documentation for
      // the contents of response.
      console.log("Successfully sent message:", response);
      process.exit(0);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
}

exports.addIncidents = (ids) => {

  // var stream = fs.createWriteStream("my_file.txt");
  // stream.once('open', function (fd) {
  //   stream.write("My first row\n");
  //   stream.write("My second row\n");
  //   stream.end();
  // });
  var ref = admin.database().ref();
  ref.child('incidents').set({
    ids
  });
  // const path = `/incidents`;
  // return firebase.push(path, incidents)
  //   .then(pushResult => {
  //     console.log('incidents saved.');
  //   });
}