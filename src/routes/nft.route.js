const express = require("express");

const validate = require("../middlewares/validate");
const { nftValidation } = require("../validations");
const { nftController } = require("../controllers");

const router = express.Router();

router.post(
  "/",
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
  validate(nftValidation.deleteNFTByTokenId),
  nftController.deleteNFTByTokenIdController
);

router.patch(
  "/",
  validate(nftValidation.updateCollectionOfNft),
  nftController.updateCollectionOfNFTController
);

router.patch(
  "/updateOwner",
  validate(nftValidation.updateOwnerNFT),
  nftController.updateOwnerNFTController
);

router.patch("/listingForSale", nftController.listingForSaleController);

router.patch("/unlistingForSale", nftController.unlistingForSaleController);

module.exports = router;
