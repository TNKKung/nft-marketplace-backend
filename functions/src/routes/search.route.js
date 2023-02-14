const express = require("express");

const { searchController } = require("../controllers");

const router = express.Router();

router.get("/", searchController.allSearchController);

module.exports = router;
