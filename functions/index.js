const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const routes = require("./src/routes");
import { corsOptions } from "./src/config/allowOrigin";

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use(cors());

app.get("/", (_, response) => {
  response.status(200).send({ message: "NFT Marketplace!" });
});

app.use("/v1/", routes);

exports.app = functions.https.onRequest(app);
