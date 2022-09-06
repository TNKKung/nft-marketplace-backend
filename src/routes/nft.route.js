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
    },
    {
      merge: true,
    }
  );
  res.send(response);
});

router.get("/", (req, res) => {
  res.send("TTTT");
});

module.exports = router;
