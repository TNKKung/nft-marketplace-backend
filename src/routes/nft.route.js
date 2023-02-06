const express = require("express");

const { jwtValidate, validate } = require("../middlewares");
const { nftValidation } = require("../validations");
const { nftController } = require("../controllers");

const router = express.Router();

router.post(
  "/",
  jwtValidate,
  validate(nftValidation.createNFT),
  nftController.createNFTController
);

router.get("/", validate(nftValidation.getAllNFT), nftController.getAllNFTs);

router.get(
  "/getNFTByOwner",
  validate(nftValidation.getNFTByOwner),
  nftController.getNFTByOwnerController
);

router.get(
  "/getNFTByTokenId",
  validate(nftValidation.getNFTByTokenId),
  nftController.getNFTByTokenIdController
);

router.delete(
  "/",
  jwtValidate,
  validate(nftValidation.deleteNFTByTokenId),
  nftController.deleteNFTByTokenIdController
);

router.patch(
  "/",
  jwtValidate,
  validate(nftValidation.updateCollectionOfNft),
  nftController.updateCollectionOfNFTController
);

router.patch(
  "/updateOwner",
  jwtValidate,
  validate(nftValidation.updateOwnerNFT),
  nftController.updateOwnerNFTController
);

router.patch(
  "/listingForSale",
  jwtValidate,
  validate(nftValidation.listingForSale),
  nftController.listingForSaleController
);

router.patch(
  "/unlistingForSale",
  jwtValidate,
  validate(nftValidation.unlistingForSale),
  nftController.unlistingForSaleController
);

router.get("/getAllTransaction", nftController.getAllTransaction);

module.exports = router;
