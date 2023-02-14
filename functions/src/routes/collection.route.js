const express = require("express");

const { collectionController } = require("../controllers");
const { jwtValidate, validate } = require("../middlewares");
const { collectionValidation } = require("../validations");

const router = express.Router();

router.post(
  "/",
  jwtValidate,
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
  jwtValidate,
  validate(collectionValidation.deleteCollectionById),
  collectionController.deleteCollectionByIdController
);

router.patch(
  "/",
  jwtValidate,
  validate(collectionValidation.updateCollection),
  collectionController.updateCollectionController
);

module.exports = router;
