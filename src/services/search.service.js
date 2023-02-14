const { store } = require("../config/firebase");

const getAllSearchList = async (keyword) => {
  const storeNFTs = await store.collection("NFTs").get();
  const storeUsers = await store.collection("Users").get();
  const storeCollections = await store.collection("Collections").get();

  let searchList = [
    { type: "user", lists: [] },
    { type: "nft", lists: [] },
    { type: "collection", lists: [] },
  ];

  storeNFTs.docs.map((doc) => {
    if (
      doc.data().tokenId.toString().includes(keyword) ||
      doc.data().ownerAddress === keyword ||
      doc.data().nameNFT.includes(keyword)
    ) {
      searchList[1].lists.push(doc.data());
    }
  });

  storeUsers.docs.map((doc) => {
    if (doc.data().address === keyword || doc.data().name.includes(keyword)) {
      searchList[0].lists.push(doc.data());
    }
  });

  storeCollections.docs.map((doc) => {
    if (doc.data().collectionName.includes(keyword)) {
      searchList[2].lists.push(doc.data());
    }
  });

  return searchList;
};

module.exports = { getAllSearchList };
