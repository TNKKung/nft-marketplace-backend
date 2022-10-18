const { store } = require("../config/firebase");

const storeCollection = store.collection("Collections");
const storeNFT = store.collection("NFTs");

const createCollection = async (body) => {
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

const getAllCollection = async () => {
  const collections = await storeCollection.get();
  const returnStore = [];
  collections.docs.map((doc) => returnStore.push({ ...doc.data() }));
  return returnStore;
};

const getCollectionById = async (id) => {
  const collections = await storeCollection.get();
  const NFTs = await storeNFT.get();
  const returnStore = [];
  const listNFT = [];
  NFTs.docs.map((doc) => {
    if (doc.data().collectionId === id) {
      listNFT.push(doc.data().tokenId);
    }
  });
  collections.docs.map((doc) => returnStore.push({ ...doc.data(), listNFT }));
  for (let i = 0; i < returnStore.length; i++) {
    if (returnStore[i].collectionId === id) {
      return returnStore[i];
    }
  }
};

const getCollectionByOwner = async (owner) => {
  const storeCollection = await store.collection("Collections").get();
  const storeNFT = await store.collection("NFTs").get();

  const returnStore = [];
  const responseData = [];
  storeCollection.docs.map((doc) => {
    const listNFT = [];
    storeNFT.docs.map((Doc) => {
      if (Doc.data().collectionId === doc.data().collectionId) {
        listNFT.push(Doc.data().tokenId);
      }
    });
    returnStore.push({ id: doc.id, ...doc.data(), listNFT });
  });
  for (let i = 0; i < returnStore.length; i++) {
    if (returnStore[i]["owner"] === owner) {
      responseData.push(returnStore[i]);
    }
  }
  return responseData;
};

const deleteCollectionById = async (id) => {
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

const updateCollection = async (body) => {
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
  createCollection,
  getAllCollection,
  getCollectionById,
  getCollectionByOwner,
  deleteCollectionById,
  updateCollection,
};
