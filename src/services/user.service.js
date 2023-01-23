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
    if (tempStore[i].address === address) {
      userOfAddress.push(tempStore[i]);
    }
  }
  return userOfAddress;
};

const addFriendList = async (address, friendAddress) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeUsers.doc(address).set({
      address: data.data().address,
      name: data.data().name,
      bio: data.data().bio,
      twitter: data.data().twitter,
      instagram: data.data().instagram,
      contact: data.data().contact,
      profileImage: data.data().profileImage,
      backgroundImage: data.data().backgroundImage,
      messageToSign: data.data().messageToSign,
      favoriteNFT: data.data().favoriteNFT,
      friendList: [...data.data().friendList, friendAddress],
    });
  }
};

const unfriendList = async (address, friendAddress) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    let tempStore = [];
    for (let i = 0; i < data.data().friendList.length; i++) {
      if (data.data().friendList[i] !== friendAddress) {
        tempStore.push(data.data().friendList[i]);
      }
    }
    console.log(tempStore);
    await storeUsers.doc(address).set({
      address: data.data().address,
      name: data.data().name,
      bio: data.data().bio,
      twitter: data.data().twitter,
      instagram: data.data().instagram,
      contact: data.data().contact,
      profileImage: data.data().profileImage,
      backgroundImage: data.data().backgroundImage,
      messageToSign: data.data().messageToSign,
      favoriteNFT: data.data().favoriteNFT,
      friendList: tempStore,
    });
  }
};

const addFavoriteNFT = async (address, tokenId) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeUsers.doc(address).set({
      address: data.data().address,
      name: data.data().name,
      bio: data.data().bio,
      twitter: data.data().twitter,
      instagram: data.data().instagram,
      contact: data.data().contact,
      profileImage: data.data().profileImage,
      backgroundImage: data.data().backgroundImage,
      messageToSign: data.data().messageToSign,
      favoriteNFT: [...data.data().favoriteNFT, tokenId],
      friendList: data.data().friendList,
    });
  }
};

const removeFavoriteNFT = async (address, tokenId) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    let tempStore = [];
    for (let i = 0; i < data.data().favoriteNFT.length; i++) {
      if (data.data().favoriteNFT[i] !== tokenId) {
        tempStore.push(data.data().favoriteNFT[i]);
      }
    }
    await storeUsers.doc(address).set({
      address: data.data().address,
      name: data.data().name,
      bio: data.data().bio,
      twitter: data.data().twitter,
      instagram: data.data().instagram,
      contact: data.data().contact,
      profileImage: data.data().profileImage,
      backgroundImage: data.data().backgroundImage,
      messageToSign: data.data().messageToSign,
      favoriteNFT: tempStore,
      friendList: data.data().friendList,
    });
  }
};

const editInfoUser = async (address, body) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeUsers.doc(address).set({
      address: data.data().address,
      name: body.name,
      bio: body.bio,
      twitter: body.twitter,
      instagram: body.instagram,
      contact: body.contact,
      profileImage: data.data().profileImage,
      backgroundImage: data.data().backgroundImage,
      messageToSign: data.data().messageToSign,
      favoriteNFT: data.data().favoriteNFT,
      friendList: data.data().friendList,
    });
  }
};

const editImageProfile = async (address, image) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeUsers.doc(address).set({
      address: data.data().address,
      name: data.data().name,
      bio: data.data().bio,
      twitter: data.data().twitter,
      instagram: data.data().instagram,
      contact: data.data().contact,
      profileImage: image,
      backgroundImage: data.data().backgroundImage,
      messageToSign: data.data().messageToSign,
      favoriteNFT: data.data().favoriteNFT,
      friendList: data.data().friendList,
    });
  }
};

const editImageBackground = async (address, image) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeUsers.doc(address).set({
      address: data.data().address,
      name: data.data().name,
      bio: data.data().bio,
      twitter: data.data().twitter,
      instagram: data.data().instagram,
      contact: data.data().contact,
      profileImage: data.data().profileImage,
      backgroundImage: image,
      messageToSign: data.data().messageToSign,
      favoriteNFT: data.data().favoriteNFT,
      friendList: data.data().friendList,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserByAddress,
  addFriendList,
  unfriendList,
  addFavoriteNFT,
  removeFavoriteNFT,
  editInfoUser,
  editImageProfile,
  editImageBackground,
};
