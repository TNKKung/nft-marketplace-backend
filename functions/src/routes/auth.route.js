const express = require("express");

const { jwtValidate, validate } = require("../middlewares");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");

const router = express.Router();

router.get(
  "/message",
  validate(authValidation.loginMessageValidate),
  authController.messageController
);

router.get(
  "/jwt",
  validate(authValidation.authJWTValidate),
  authController.authJWTController
);

router.get(
  "/requestAccessToken",
  jwtValidate,
  validate(authValidation.requestAccessTokenValidate),
  authController.requestAccessToken
);

module.exports = router;
