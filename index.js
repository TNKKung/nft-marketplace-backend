const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const Web3 = require("web3");
const { recoverPersonalSignature } = require("eth-sig-util");

const serviceAccount = require("./serviceAccountKey.json");

const app = express();
app.use(express.json());
const port = 4000;
const isValidEthAddress = (address) => Web3.utils.isAddress(address);

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const dbNFT = db.collection("NFT");

const makeId = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

const getMessageToSign = async (req, res) => {
  try {
    const { address } = req.query;

    if (!isValidEthAddress(address)) {
      return res.send({ error: "invalid_address" });
    }

    const randomString = makeId(20);
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
};

app.get("/message", getMessageToSign);

const isValidSignature = (address, signature, messageToSign) => {
  if (!address || typeof address !== "string" || !signature || !messageToSign) {
    return false;
  }

  const signingAddress = recoverPersonalSignature({
    data: messageToSign,
    sig: signature,
  });

  if (!signingAddress || typeof signingAddress !== "string") {
    return false;
  }

  return signingAddress.toLowerCase() === address.toLowerCase();
};

const getJWT = async (req, res) => {
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
};

app.get("/jwt", getJWT);

app.post("/createNFT", async (req, res) => {
  const id = req.body.owner;
  const response = await dbNFT.doc().set(
    {
      ownerAddres: req.body.owner,
      nameNFT: req.body.nameNFT,
      description: req.body.description,
      tokenId: req.body.tokenId,
      category: req.body.category,
    },
    {
      merge: true,
    }
  );
  res.send(response);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`nft marketplace app listening on port ${port}`);
});
