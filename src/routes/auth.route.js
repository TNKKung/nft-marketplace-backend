const express = require("express");

const { isValidEthAddress } = require("../utils/addressHelper");
const { isValidSignature } = require("../utils/signatureHelper");
const { admin } = require("../config/firebase");

const router = express.Router();

router.get("/message", async (req, res) => {
  try {
    const { address } = req.query;

    if (!isValidEthAddress(address)) {
      return res.send({ error: "invalid_address" });
    }

    // const randomString = makeId(20);
    let messageToSign = `Login NFT Marketplace by address: ${address}`;

    const user = await admin.firestore().collection("Users").doc(address).get();

    if (user.data() && user.data().messageToSign) {
      messageToSign = user.data().messageToSign;
    } else {
      admin.firestore().collection("Users").doc(address).set(
        {
          address: address,
        },
        {
          merge: true,
        }
      );
    }

    return res.send({ messageToSign, error: null });
  } catch (error) {
    console.log(error);
    return res.send({ error: "server_error" });
  }
});

router.get("/jwt", async (req, res) => {
  try {
    const { address, signature } = req.query;

    if (!isValidEthAddress(address) || !signature) {
      return res.send({ error: "invalid_parameters" });
    }

    const [customToken, doc] = await Promise.all([
      admin.auth().createCustomToken(address),
      admin.firestore().collection("users").doc(address).get(),
    ]);

    if (!doc.exists) {
      return res.send({ error: "invalid_message_to_sign" });
    }

    const { messageToSign } = doc.data();

    if (!messageToSign) {
      return res.send({ error: "invalid_message_to_sign" });
    }

    const validSignature = isValidSignature(address, signature, messageToSign);

    if (!validSignature) {
      return res.send({ error: "invalid_signature" });
    }

    // Delete messageToSign as it can only be used once
    admin.firestore().collection("users").doc(address).set(
      {
        messageToSign: null,
      },
      {
        merge: true,
      }
    );

    return res.send({ customToken, error: null });
  } catch (err) {
    console.log("Error:", err);
    return res.send({ error: "server_error" });
  }
});

module.exports = router;
