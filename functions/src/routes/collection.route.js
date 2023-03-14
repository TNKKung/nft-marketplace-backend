const express = require("express");

const { collectionController } = require("../controllers");
const { jwtValidate, validate } = require("../middlewares");
const { collectionValidation } = require("../validations");

const router = express.Router();

router.post(
  "/",
  jwtValidate,
  validate(collectionValidation.createCollectionValidate),
  collectionController.createCollectionController
);

router.get(
  "/",
  validate(collectionValidation.getAllCollectionValidate),
  collectionController.getAllCollectionController
);

router.get(
  "/getCollectionById",
  validate(collectionValidation.getCollectionByIdValidate),
  collectionController.getCollectionByIdController
);

router.get(
  "/getCollectionByOwner",
  validate(collectionValidation.getCollectionByOwnerValidate),
  collectionController.getCollectionByOwnerController
);

router.delete(
  "/",
  jwtValidate,
  validate(collectionValidation.deleteCollectionByIdValidate),
  collectionController.deleteCollectionByIdController
);

router.patch(
  "/",
  jwtValidate,
  validate(collectionValidation.updateCollectionValidate),
  collectionController.updateCollectionController
);

module.exports = router;
