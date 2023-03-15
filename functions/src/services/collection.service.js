const { store } = require("../config/firebase");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");
const Web3 = require("web3");

const { getProvider } = require("../utils/provider");
const {
  privateKey,
  nftContract,
  marketplaceContract,
} = require("../config/config");

const storeCollection = store.collection("Collections");
const storeNFT = store.collection("NFTs");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createCollectionService = async (body) => {
  const response = await storeCollection.add({
    owner: body.owner,
    collectionName: body.collectionName,
    description: body.description,
  });
  const data = await storeCollection.doc(response.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    const info = {
      collectionId: response.id,
      owner: data.data().owner,
      collectionName: data.data().collectionName,
      description: data.data().description,
    };
    await store.collection("Collections").doc(response.id).set(info);

    return info;
  }
};

const getAllCollectionService = async () => {
  const collections = await storeCollection.get();

  return collections.docs.map((doc) => {
    return doc.data();
  });
};

const getCollectionByIdService = async (id) => {
  const collections = await storeCollection.doc(id).get();
  const NFTs = await storeNFT.get();
  const provider = getProvider();
  const web3 = new Web3();

  const signer = new ethers.Wallet(privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(nftContract, abi, signer);

  const abiMarketplace = [
    "function priceFromTokenId(uint256 tokenId) view returns (uint256)",
  ];

  const marketplace = new ethers.Contract(
    marketplaceContract,
    abiMarketplace,
    signer
  );

  const filterNFTs = NFTs.docs.filter((doc) => doc.data().collectionId === id);
  const data = await Promise.all(
    filterNFTs.map(async (doc) => {
      const result = await contract.functions.tokenURI(doc.data().tokenId);
      const resultPrice = await marketplace.functions.priceFromTokenId(
        doc.data().tokenId
      );
      const wei = web3.utils.toBN(resultPrice[0]["_hex"]).toString();
      const eth = ethers.utils.formatEther(wei);
      return {
        tokenId: doc.data().tokenId,
        nameNFT: doc.data().nameNFT,
        tokenURI: result[0],
        price: doc.data().statusSale ? eth : "",
      };
    })
  );

  return {
    ...collections.data(),
    listNFT: data,
  };
};

const getCollectionByOwnerService = async (owner) => {
  const storeCollection = await store.collection("Collections").get();
  const storeNFT = await store.collection("NFTs").get();

  const filterCollection = storeCollection.docs.filter(
    (doc) => doc.data().owner === owner
  );

  return Promise.all(
    filterCollection.map(async (collection) => {
      const getCollection = await getCollectionByIdService(
        collection.data().collectionId
      );
      return getCollection;
    })
  );
};

const deleteCollectionByIdService = async (id) => {
  const NFTs = await storeNFT.get();
  NFTs.docs.map(async (doc) => {
    if (doc.data().collectionId === id) {
      const info = {
        ownerAddres: doc.data().ownerAddres,
        nameNFT: doc.data().nameNFT,
        description: doc.data().description,
        tokenId: doc.data().tokenId,
        category: doc.data().category,
        collectionId: "-",
      };
      await storeNFT.doc(doc.id).set(info);
    }
  });
  await storeCollection.doc(id).delete();
  return "Delete collection success";
};

const updateCollectionService = async (body) => {
  const data = await storeCollection.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeCollection.doc(body.id).set({
      collectionId: data.data().collectionId,
      owner: data.data().owner,
      collectionName: body.collectionName,
      description: body.description,
    });
  }
  return "update collection success";
};

module.exports = {
  createCollectionService,
  getAllCollectionService,
  getCollectionByIdService,
  getCollectionByOwnerService,
  deleteCollectionByIdService,
  updateCollectionService,
};
