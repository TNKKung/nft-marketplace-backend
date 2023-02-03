const express = require("express");

const { jwtValidate, validate } = require("../middlewares");
const { userValidation } = require("../validations");
const { userController } = require("../controllers");

const router = express.Router();

router.get(
  "/",
  jwtValidate,
  validate(userValidation.getAllUsers),
  userController.getAllUserController
);

router.get(
  "/getUserByAddress",
  jwtValidate,
  validate(userValidation.getUserByAddress),
  userController.getUserByAddressController
);

router.post(
  "/addFriendList",
  jwtValidate,
  validate(userValidation.addFriendList),
  userController.addFriendListController
);

router.post(
  "/unfriendList",
  jwtValidate,
  validate(userValidation.unfriendList),
  userController.unfriendListController
);

router.post(
  "/addFavoriteNFT",
  jwtValidate,
  validate(userValidation.addFavoriteNFT),
  userController.addFavoriteNFTController
);

router.post(
  "/removeFavoriteNFT",
  jwtValidate,
  validate(userValidation.removeFavoriteNFT),
  userController.removeFavoriteNFTController
);

router.post(
  "/editInfoUser",
  jwtValidate,
  validate(userValidation.editInfoUser),
  userController.editInfoUserController
);

router.post(
  "/editImageProfile",
  jwtValidate,
  validate(userValidation.editImageProfile),
  userController.editImageProfileController
);

router.post(
  "/editImageBackground",
  jwtValidate,
  validate(userValidation.editImageBackground),
  userController.editImageBackgroundController
);

module.exports = router;
