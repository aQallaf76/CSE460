const admin = require('firebase-admin');

// Use Render secret file path in production, local file in development
const serviceAccountPath = process.env.NODE_ENV === 'production' 
  ? '/etc/secrets/cse-460-project-firebase-adminsdk-fbsvc-78d1efa5b3.json'
  : './cse-460-project-firebase-adminsdk-fbsvc-78d1efa5b3.json';

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = db; 