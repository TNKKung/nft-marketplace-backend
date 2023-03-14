const express = require("express");

const { jwtValidate, validate } = require("../middlewares");
const { nftValidation } = require("../validations");
const { nftController } = require("../controllers");

const router = express.Router();

router.get("/getAllTransaction", nftController.getAllTransaction);

router.get(
  "/",
  validate(nftValidation.getAllNFTValidate),
  nftController.getAllNFTs
);

router.get(
  "/getNFTByOwner",
  validate(nftValidation.getNFTByOwnerValidate),
  nftController.getNFTByOwnerController
);

router.get(
  "/getNFTCreatedByOwner",
  validate(nftValidation.getNFTCreatedByOwnerValidate),
  nftController.getNFTCreatedByOwnerController
);

router.get(
  "/getNFTByTokenId",
  validate(nftValidation.getNFTByTokenIdValidate),
  nftController.getNFTByTokenIdController
);

router.post(
  "/",
  jwtValidate,
  validate(nftValidation.createNFTValidate),
  nftController.createNFTController
);

router.post(
  "/addTransactionHash",
  jwtValidate,
  nftController.addTransactionHashController
);

router.delete(
  "/",
  jwtValidate,
  validate(nftValidation.deleteNFTByTokenIdValidate),
  nftController.deleteNFTByTokenIdController
);

router.patch(
  "/",
  jwtValidate,
  validate(nftValidation.updateCollectionOfNftValidate),
  nftController.updateCollectionOfNFTController
);

router.patch(
  "/updateOwner",
  jwtValidate,
  validate(nftValidation.updateOwnerNFTValidate),
  nftController.updateOwnerNFTController
);

router.patch(
  "/listingForSale",
  jwtValidate,
  validate(nftValidation.listingForSaleValidate),
  nftController.listingForSaleController
);

router.patch(
  "/unlistingForSale",
  jwtValidate,
  validate(nftValidation.unlistingForSaleValidate),
  nftController.unlistingForSaleController
);

module.exports = router;
