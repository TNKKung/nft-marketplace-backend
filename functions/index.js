const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://nft-marketplace-frontend.web.app",
  })
);

app.get("/", (_, response) => {
  response.status(200).send({ message: "NFT Marketplace!" });
});

app.use("/v1/", routes);

exports.app = functions.https.onRequest(app);
