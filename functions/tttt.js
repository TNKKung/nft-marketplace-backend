const functions = require("firebase-functions");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send({ data: "hello nft marketplace" });
});

exports.app = functions.https.onRequest(app);

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
