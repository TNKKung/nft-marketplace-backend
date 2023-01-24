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

router.post(
  "/addFriendList",
  validate(userValidation.addFriendList),
  userController.addFriendListController
);

router.post(
  "/unfriendList",
  validate(userValidation.unfriendList),
  userController.unfriendListController
);

router.post(
  "/addFavoriteNFT",
  validate(userValidation.addFavoriteNFT),
  userController.addFavoriteNFTController
);

router.post(
  "/removeFavoriteNFT",
  validate(userValidation.removeFavoriteNFT),
  userController.removeFavoriteNFTController
);

router.post(
  "/editInfoUser",
  validate(userValidation.editInfoUser),
  userController.editInfoUserController
);

router.post(
  "/editImageProfile",
  validate(userValidation.editImageProfile),
  userController.editImageProfileController
);

router.post(
  "/editImageBackground",
  validate(userValidation.editImageBackground),
  userController.editImageBackgroundController
);

module.exports = router;
