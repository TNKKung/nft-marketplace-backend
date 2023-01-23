const { store } = require("../config/firebase");
// const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");

// const { getProvider } = require("../utils/provider");
// const config = require("../config/config");

const storeUsers = store.collection("Users");
dotenv.config({ path: path.join(__dirname, "../../.env") });

const getAllUsers = async () => {
  const users = await storeUsers.get();
  const data = [];

  users.docs.map((doc) => {
    data.push({ ...doc.data() });
  });

  return data;
};

const getUserByAddress = async (address) => {
  const storeUser = await storeUsers.get();
  let tempStore = [];
  let userOfAddress = [];
  storeUser.docs.map((doc) => tempStore.push(doc.data()));
  for (let i = 0; i < tempStore.length; i++) {
    console.log();
    if (tempStore[i].address === address) {
      userOfAddress.push(tempStore[i]);
    }
  }
  return userOfAddress;
};

module.exports = {
  getAllUsers,
  getUserByAddress,
};
