const admin = require('firebase-admin');
const serviceAccount = require('./cse-460-project-firebase-adminsdk-fbsvc-78d1efa5b3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db; 