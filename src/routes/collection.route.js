const express = require("express");

const { store } = require("../config/firebase");

const router = express.Router();
const storeNFT = store.collection("Collections");

router.post("/", async (req, res) => {
  const storeCollection = await store.collection("Collections").get();
  const returnStore = [];
  storeCollection.docs.map((doc) => returnStore.push(doc.data()));
  const response = await storeNFT.doc().set({
    id: returnStore.length,
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
  const returnStore = [];
  storeCollection.docs.map((doc) => returnStore.push(doc.data()));
  for (let i = 0; i < returnStore.length; i++) {
    if (returnStore[i].id.toString() === id) {
      res.send(returnStore[i]);
    }
  }
});

router.get("/getCollectionByOwner", async (req, res) => {
  const { owner } = req.query;
  const storeCollection = await store.collection("Collections").get();
  const returnStore = [];
  storeCollection.docs.map((doc) => returnStore.push(doc.data()));
  for (let i = 0; i < returnStore.length; i++) {
    if (returnStore[i].owner.toString() === owner) {
      returnStore.push(returnStore[i]);
    }
  }
  res.send(returnStore);
});

module.exports = router;
