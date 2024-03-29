const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

const { admin } = require("../config/firebase");
const config = require("../config/config");
const { isValidEthAddress } = require("../utils/addressHelper");
const { isValidSignature } = require("../utils/signatureHelper");
const { jwtGenerate, jwtRefreshTokenGenerate } = require("../utils/jwtHelper");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const loginMessage = async (address) => {
  try {
    if (!isValidEthAddress(address)) {
      return { error: "invalid_address" };
    }

    // const randomString = makeId(20);
    let messageToSign = `Login NFT Marketplace by address: ${address}`;

    const user = await admin.firestore().collection("Users").doc(address).get();

    if (user.data()) {
      messageToSign = user.data().messageToSign;
    } else {
      admin.firestore().collection("Users").doc(address).set(
        {
          address: address,
          name: address,
          bio: "",
          twitter: "",
          instagram: "",
          contact: "",
          profileImage: "",
          backgroundImage: "",
          messageToSign,
          friendList: [],
          favoriteNFT: [],
        },
        {
          merge: true,
        }
      );
    }

    return { messageToSign, error: null };
  } catch (error) {
    console.log(error);
    return { error: "server_error" };
  }
};

const authJWT = async (address, signature) => {
  try {
    if (!isValidEthAddress(address) || !signature) {
      return { error: "invalid_parameters" };
    }

    const [accessToken, refreshToken, doc] = await Promise.all([
      jwtGenerate(address),
      jwtRefreshTokenGenerate(address),
      admin.firestore().collection("Users").doc(address).get(),
    ]);

    if (!doc.exists) {
      return { error: "invalid_message_to_sign" };
    }

    const { messageToSign } = doc.data();

    if (!messageToSign) {
      return { error: "invalid_message_to_sign" };
    }

    const validSignature = isValidSignature(address, signature, messageToSign);

    if (!validSignature) {
      return { error: "invalid_signature" };
    }

    // // Delete messageToSign as it can only be used once
    // admin.firestore().collection("Users").doc(address).set(
    //   {
    //     messageToSign: null,
    //   },
    //   {
    //     merge: true,
    //   }
    // );

    return { accessToken, refreshToken, error: null };
  } catch (err) {
    console.log("Error:", err);
    return { error: "server_error" };
  }
};

const requestAccessToken = async (address) => {
  try {
    if (!isValidEthAddress(address)) {
      return { error: "invalid_parameters" };
    }
    const [accessToken] = [jwtGenerate(address)];

    return { accessToken, error: null };
  } catch (err) {
    console.log("Error:", err);
    return { error: "server_error" };
  }
};

module.exports = { loginMessage, authJWT, requestAccessToken };
