const { store } = require("../config/firebase");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");

const { getProvider } = require("../utils/provider");
const config = require("../config/config");

const storeNFT = store.collection("NFTs");
dotenv.config({ path: path.join(__dirname, "../../.env") });

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
  const data = [];
  const returnData = [];
  const provider = getProvider(11155111);

  const signer = new ethers.Wallet(config.privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(
    "0x1C2e4a65351c3C0968D2624a15b3B446E4fcee11",
    abi,
    signer
  );
  NFTs.docs.map((doc) => {
    data.push({ ...doc.data() });
  });

  for (let i = 0; i < data.length; i++) {
    const result = await contract.functions.tokenURI(data[i].tokenId);
    returnData.push({ ...data[i], tokenURI: result[0] });
  }
  return returnData;
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
  const provider = getProvider(11155111);

  const signer = new ethers.Wallet(config.privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(
    "0x1C2e4a65351c3C0968D2624a15b3B446E4fcee11",
    abi,
    signer
  );

  storeN.docs.map((doc) => tempStore.push({ id: doc.id, ...doc.data() }));
  const result = await contract.functions.tokenURI(tempStore[0].tokenId);

  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].tokenId.toString() === tokenId) {
      nftOfTokenId.push({ ...tempStore[i], tokenURI: result[0] });
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

const updateOwnerNFT = async (body) => {
  const data = await storeNFT.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    const provider = getProvider(11155111);

    const signer = new ethers.Wallet(config.privateKey, provider);

    const address = body.contract;
    const abi = ["function ownerOf(uint256 tokenId) view returns (address)"];

    const contract = new ethers.Contract(address, abi, signer);
    const result = await contract.functions.ownerOf(data.data().tokenId);

    await storeNFT.doc(body.id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddres: result[0],
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
    });
  }
  return "update new owner";
};

module.exports = {
  createNFTService,
  getAllNFT,
  getNFTByOwnerService,
  getNFTByTokenId,
  deleteNFTByTokenId,
  updateCollectionOfNft,
  updateOwnerNFT,
};
