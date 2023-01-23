const admin = require("firebase-admin");

const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const store = admin.firestore();
const storage = admin.storage();

module.exports = { admin, store, storage };
