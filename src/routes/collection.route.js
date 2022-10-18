const express = require("express");

const { store } = require("../config/firebase");
const { collectionController } = require("../controllers");
const validate = require("../middlewares/validate");
const { collectionValidation } = require("../validations");

const router = express.Router();

router.post(
  "/",
  validate(collectionValidation.createCollection),
  collectionController.createCollectionController
);

router.get(
  "/",
  validate(collectionValidation.getAllCollection),
  collectionController.getAllCollectionController
);

router.get(
  "/getCollectionById",
  validate(collectionValidation.getCollectionById),
  collectionController.getCollectionByIdController
);

router.get(
  "/getCollectionByOwner",
  validate(collectionValidation.getCollectionByOwner),
  collectionController.getCollectionByOwnerController
);

router.delete(
  "/",
  validate(collectionValidation.deleteCollectionById),
  collectionController.deleteCollectionByIdController
);

router.patch(
  "/",
  validate(collectionValidation.updateCollection),
  collectionController.updateCollectionController
);

module.exports = router;
