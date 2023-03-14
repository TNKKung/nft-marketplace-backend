const express = require("express");

const { validate } = require("../middlewares");
const { searchController } = require("../controllers");
const { searchValidation } = require("../validations");

const router = express.Router();

router.get(
  "/",
  validate(searchValidation.getAllSearchValidate),
  searchController.allSearchController
);

router.get(
  "/getNFTSearch",
  validate(searchValidation.getNFTsSearchValidate),
  searchController.nftsSearchController
);

router.get(
  "/getUserSearch",
  validate(searchValidation.getUsersSearchValidate),
  searchController.usersSearchController
);

router.get(
  "/getCollectionSearch",
  validate(searchValidation.getCollectionsSearchValidate),
  searchController.collectionsSearchController
);

module.exports = router;
