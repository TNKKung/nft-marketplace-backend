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
const storeUser = store.collection("Users");

const getAllSearchListService = async (keyword) => {
  const storeNFTs = await store.collection("NFTs").get();
  const storeUsers = await store.collection("Users").get();
  const storeCollections = await store.collection("Collections").get();

  const filterNFTs = storeNFTs.docs.filter(
    (doc) =>
      doc.data().tokenId.toString().includes(keyword) ||
      doc.data().ownerAddress === keyword ||
      doc.data().nameNFT.includes(keyword)
  );

  const filterUsers = storeUsers.docs.filter(
    (doc) => doc.data().address === keyword || doc.data().name.includes(keyword)
  );

  const filterCollections = storeCollections.docs.filter((doc) =>
    doc.data().collectionName.includes(keyword)
  );

  return {
    nft: filterNFTs.map((nft) => nft.data()),
    user: filterUsers.map((user) => user.data()),
    collection: filterCollections.map((collection) => collection.data()),
  };
};

const getNFTsSearchService = async (keyword) => {
  const storeNFTs = await store.collection("NFTs").get();
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

  const filterNFTs = storeNFTs.docs.filter(
    (doc) =>
      doc.data().tokenId.toString().includes(keyword) ||
      doc.data().ownerAddress === keyword ||
      doc.data().nameNFT.includes(keyword)
  );

  return Promise.all(
    filterNFTs.map(async (doc) => {
      const result = await contract.functions.tokenURI(doc.data().tokenId);
      const resultPrice = await marketplace.functions.priceFromTokenId(
        doc.data().tokenId
      );
      const storeCollection = await store
        .collection("Collections")
        .doc(doc.data().collectionId)
        .get();
      const wei = web3.utils.toBN(resultPrice[0]["_hex"]).toString();
      const eth = ethers.utils.formatEther(wei);
      return {
        tokenId: doc.data().tokenId,
        nameNFT: doc.data().nameNFT,
        tokenURI: result[0],
        collectionName: storeCollection.data()
          ? storeCollection.data().collectionName
          : "",
        category: doc.data().category,
        statusSale: doc.data().statusSale,
        price: doc.data().statusSale ? eth : "",
      };
    })
  );
};

const getUsersSearchService = async (keyword) => {
  const storeUsers = await store.collection("Users").get();

  const filterUsers = storeUsers.docs.filter(
    (doc) => doc.data().address === keyword || doc.data().name.includes(keyword)
  );

  return filterUsers.map((user) => user.data());
};

const getCollectionSearchService = async (keyword) => {
  const collections = await storeCollection.get();
  const NFTs = await storeNFT.get();
  const provider = getProvider();

  const signer = new ethers.Wallet(privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];
  const contract = new ethers.Contract(nftContract, abi, signer);

  const filterCollections = collections.docs.filter((doc) =>
    doc.data().collectionName.includes(keyword)
  );

  return Promise.all(
    filterCollections.map(async (data) => {
      const filterNFTs = NFTs.docs.filter(
        (doc) => doc.data().collectionId === data.data().collectionId
      );

      const nftInfo = filterNFTs.map((doc) => doc.data());
      let result;
      const user = await storeUser.doc(data.data().owner).get();
      if (nftInfo[0]) {
        result = await contract.functions.tokenURI(nftInfo[0].tokenId);
        return {
          ...data.data(),
          nftImage: result,
          ownerName: user.data().name,
          profileImage: user.data().profileImage,
        };
      }
      return {
        ...data.data(),
        nftImage: "",
        ownerName: user.data().name,
        profileImage: user.data().profileImage,
      };
    })
  );
};

module.exports = {
  getAllSearchListService,
  getNFTsSearchService,
  getUsersSearchService,
  getCollectionSearchService,
};
