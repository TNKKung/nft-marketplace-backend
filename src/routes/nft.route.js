const express = require("express");

const { store } = require("../config/firebase");

const router = express.Router();
const storeNFT = store.collection("NFTs");

router.post("/", async (req, res) => {
  const id = req.body.owner;
  const response = await storeNFT.doc().set(
    {
      ownerAddres: req.body.owner,
      nameNFT: req.body.nameNFT,
      description: req.body.description,
      tokenId: req.body.tokenId,
      category: req.body.category,
      collectionId: req.body.collection,
    },
    {
      merge: true,
    }
  );
  res.send(response);
});

router.get("/getNFTByOwner", async (req, res) => {
  const storeN = await store.collection("NFTs").get();
  const { address } = req.query;
  let tempStore = [];
  let storeOfOwner = [];
  storeN.docs.map((doc) => tempStore.push(doc.data()));
  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].ownerAddres === address) {
      storeOfOwner.push(tempStore[i]);
    }
  }
  res.send(storeOfOwner);
});

router.get("/getNFTByTokenId", async (req, res) => {
  const storeN = await store.collection("NFTs").get();
  const { tokenId } = req.query;
  let tempStore = [];
  let nftOfTokenId = [];
  storeN.docs.map((doc) => tempStore.push(doc.data()));
  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].tokenId.toString() === tokenId) {
      nftOfTokenId.push(tempStore[i]);
    }
  }
  res.send(nftOfTokenId);
});

router.patch("/", async (req, res) => {
  const data = await store.doc(req.body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeNFT.doc(req.body.tokenId).set({
      collectionId: data.data().collectionId,
      owner: data.data().owner,
      collectionName: req.body.collectionName,
      description: req.body.description,
    });
  }
});

module.exports = router;
