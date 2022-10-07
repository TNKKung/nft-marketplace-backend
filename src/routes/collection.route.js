const express = require("express");

const { store } = require("../config/firebase");

const router = express.Router();
const storeNFT = store.collection("Collections");

router.post("/", async (req, res) => {
  const storeCollection = await store.collection("Collections").get();
  const returnStore = [];
  storeCollection.docs.map((doc) => returnStore.push(doc.data()));
  const response = await storeNFT.doc().set({
    collectionId: returnStore.length,
    owner: req.body.owner,
    collectionName: req.body.collectionName,
    description: req.body.description,
  });
  res.send(response);
});

router.get("/", async (req, res) => {
  const storeCollection = await store.collection("Collections").get();
  const returnStore = [];
  storeCollection.docs.map((doc) => returnStore.push(doc.data()));
  res.send(returnStore);
});

router.get("/getCollectionById", async (req, res) => {
  const { id } = req.query;
  const storeCollection = await store.collection("Collections").get();
  const storeNFT = await store.collection("NFTs").get();
  const returnStore = [];
  const listNFT = [];
  storeNFT.docs.map((doc) => {
    if (doc.data().collectionId === id) {
      listNFT.push(doc.data().tokenId);
    }
  });
  storeCollection.docs.map((doc) =>
    returnStore.push({ ...doc.data(), listNFT })
  );
  for (let i = 0; i < returnStore.length; i++) {
    if (returnStore[i].collectionId === id) {
      res.send(returnStore[i]);
    }
  }
});

router.get("/getCollectionByOwner", async (req, res) => {
  const { owner } = req.query;
  const storeCollection = await store.collection("Collections").get();
  const storeNFT = await store.collection("NFTs").get();
  const listNFT = [];
  storeNFT.docs.map((doc) => {
    if (doc.data().collectionId === id) {
      listNFT.push(doc.data().tokenId);
    }
  });
  const returnStore = [];
  const responseData = [];
  storeCollection.docs.map((doc) =>
    returnStore.push({ id: doc.id, ...doc.data(), listNFT })
  );
  for (let i = 0; i < returnStore.length; i++) {
    if (returnStore[i]["owner"] === owner) {
      responseData.push(returnStore[i]);
    }
  }
  res.send(responseData);
});

router.delete("/", async (req, res) => {
  const { id } = req.query;
  await store.collection("Collections").doc(id).delete();
  res.send("delete success");
});

router.patch("/", async (req, res) => {
  const data = await store.collection("Collections").doc(req.body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    console.log(data.data());
    await store.collection("Collections").doc(req.body.id).set({
      collectionId: data.data().collectionId,
      owner: data.data().owner,
      collectionName: req.body.collectionName,
      description: req.body.description,
    });
  }
});

module.exports = router;
