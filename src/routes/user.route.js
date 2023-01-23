const express = require("express");

const validate = require("../middlewares/validate");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  validate(userValidation.getAllUsers),
  userController.getAllUserController
);

router.get(
  "/getUserByAddress",
  validate(userValidation.getUserByAddress),
  userController.getUserByAddressController
);

router.post("/addFriendList", userController.addFriendListController);

router.post("/addFavoriteNFT", userController.addFavoriteNFTController);

router.post("/editInfoUser", userController.editInfoUserController);

router.post("/");

module.exports = router;
