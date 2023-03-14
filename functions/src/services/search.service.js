const { store } = require("../config/firebase");

const getAllSearchListService = async (keyword) => {
  const storeNFTs = await store.collection("NFTs").get();
  const storeUsers = await store.collection("Users").get();
  const storeCollections = await store.collection("Collections").get();

  // storeNFTs.docs.map((doc) => {
  //   if (
  //     doc.data().tokenId.toString().includes(keyword) ||
  //     doc.data().ownerAddress === keyword ||
  //     doc.data().nameNFT.includes(keyword)
  //   ) {
  //     searchList[1].lists.push(doc.data());
  //   }
  // });

  // storeUsers.docs.map((doc) => {
  //   if (doc.data().address === keyword || doc.data().name.includes(keyword)) {
  //     searchList[0].lists.push(doc.data());
  //   }
  // });

  // storeCollections.docs.map((doc) => {
  //   if (doc.data().collectionName.includes(keyword)) {
  //     searchList[2].lists.push(doc.data());
  //   }
  // });

  // return searchList;

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

  return [
    {
      type: "nft",
      lists: filterNFTs.map((nft) => nft.data()),
    },
    {
      type: "user",
      lists: filterUsers.map((user) => user.data()),
    },
    {
      type: "collection",
      lists: filterCollections.map((collection) => collection.data()),
    },
  ];
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
  const storeCollections = await store.collection("Collections").get();

  const filterCollections = storeCollections.docs.filter((doc) =>
    doc.data().collectionName.includes(keyword)
  );

  return filterCollections.map((collection) => collection.data());
};

module.exports = {
  getAllSearchListService,
  getNFTsSearchService,
  getUsersSearchService,
  getCollectionSearchService,
};
