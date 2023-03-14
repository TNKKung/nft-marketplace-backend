// const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");

const { store } = require("../config/firebase");
// const { getProvider } = require("../utils/provider");
// const config = require("../config/config");

const storeUsers = store.collection("Users");
dotenv.config({ path: path.join(__dirname, "../../.env") });

const getAllUsersService = async () => {
  const users = await storeUsers.get();

  return users.docs.map((doc) => {
    return { ...doc.data() };
  });
};

const getUserByAddressService = async (address) => {
  const storeUser = await storeUsers.get();

  const filterData = storeUser.docs.filter(
    (doc) => doc.data().address === address
  );

  const data = filterData.map((data) => data.data());

  return data[0];
};

const addFriendListService = async (address, friendAddress) => {
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

const unfriendListService = async (address, friendAddress) => {
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

const addFavoriteNFTService = async (address, body) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    const storeNFTs = await store.collection("NFTs").get();
    const dataNFTs = [];
    storeNFTs.docs.map((doc) => {
      dataNFTs.push({ ...doc.data() });
    });
    let NFT;
    for (let i = 0; i < dataNFTs.length; i++) {
      if (dataNFTs[i].tokenId === body.tokenId) {
        NFT = dataNFTs[i];
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
      favoriteNFT: [
        ...data.data().favoriteNFT,
        {
          tokenId: body.tokenId,
          nameNFT: NFT.nameNFT,
          category: NFT.category,
        },
      ],
      friendList: data.data().friendList,
    });
  }
};

const removeFavoriteNFTService = async (address, tokenId) => {
  const data = await storeUsers.doc(address).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    let tempStore = [];
    for (let i = 0; i < data.data().favoriteNFT.length; i++) {
      if (data.data().favoriteNFT[i].tokenId !== tokenId) {
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
    return tempStore;
  }
};

const editInfoUserService = async (address, body) => {
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

const editImageProfileService = async (address, image) => {
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

const editImageBackgroundService = async (address, image) => {
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
  getAllUsersService,
  getUserByAddressService,
  addFriendListService,
  unfriendListService,
  addFavoriteNFTService,
  removeFavoriteNFTService,
  editInfoUserService,
  editImageProfileService,
  editImageBackgroundService,
};
