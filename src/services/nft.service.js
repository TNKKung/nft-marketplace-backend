const { store } = require("../config/firebase");

const storeNFT = store.collection("NFTs");

const createNFTService = async (body) => {
  const response = await storeNFT.add({
    ownerAddres: body.ownerAddres,
    nameNFT: body.nameNFT,
    description: body.description,
    category: body.category,
    collectionId: body.collectionId,
    tokenId: body.tokenId,
  });
  return response;
};

const getAllNFT = async () => {
  const NFTs = await storeNFT.get();
  const returnStore = [];
  NFTs.docs.map((doc) => returnStore.push({ ...doc.data() }));
  return returnStore;
};

const getNFTByOwnerService = async (address) => {
  const storeN = await storeNFT.get();
  let tempStore = [];
  let storeOfOwner = [];
  storeN.docs.map((doc) => tempStore.push(doc.data()));
  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].ownerAddres === address) {
      storeOfOwner.push(tempStore[i]);
    }
  }
  return storeOfOwner;
};

const getNFTByTokenId = async (tokenId) => {
  const storeN = await storeNFT.get();
  let tempStore = [];
  let nftOfTokenId = [];
  storeN.docs.map((doc) => tempStore.push(doc.data()));
  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].tokenId.toString() === tokenId) {
      nftOfTokenId.push(tempStore[i]);
    }
  }
  return nftOfTokenId;
};

const deleteNFTByTokenId = async (tokenId) => {
  await storeNFT.doc(tokenId).delete();
  return "delete NFT Success";
};

const updateCollectionOfNft = async (body) => {
  const data = await storeNFT.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeNFT.doc(body.id).set({
      tokenId: data.data().tokenId,
      collectionId: body.collectionId,
      ownerAddres: data.data().ownerAddres,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
    });
  }
  return "update new collectionId";
};

module.exports = {
  createNFTService,
  getAllNFT,
  getNFTByOwnerService,
  getNFTByTokenId,
  deleteNFTByTokenId,
  updateCollectionOfNft,
};
