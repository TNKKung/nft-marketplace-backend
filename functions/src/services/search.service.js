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

  const filterNFTs = storeNFTs.docs.filter(
    (doc) =>
      doc.data().tokenId.toString().includes(keyword) ||
      doc.data().ownerAddress === keyword ||
      doc.data().nameNFT.includes(keyword)
  );

  return filterNFTs.map((nft) => nft.data());
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
