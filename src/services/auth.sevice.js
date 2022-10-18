const { admin } = require("../config/firebase");

const { isValidEthAddress } = require("../utils/addressHelper");
const { isValidSignature } = require("../utils/signatureHelper");

const loginMessage = async (address) => {
  try {
    if (!isValidEthAddress(address)) {
      return { error: "invalid_address" };
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

    const [customToken, doc] = await Promise.all([
      admin.auth().createCustomToken(address),
      admin.firestore().collection("users").doc(address).get(),
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

    // Delete messageToSign as it can only be used once
    admin.firestore().collection("users").doc(address).set(
      {
        messageToSign: null,
      },
      {
        merge: true,
      }
    );

    return { customToken, error: null };
  } catch (err) {
    console.log("Error:", err);
    return { error: "server_error" };
  }
};

module.exports = { loginMessage, authJWT };
