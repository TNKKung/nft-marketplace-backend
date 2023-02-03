const express = require("express");

const { jwtValidate, validate } = require("../middlewares");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");

const router = express.Router();

router.get(
  "/message",
  validate(authValidation.loginMessage),
  authController.messageController
);

router.get(
  "/jwt",
  validate(authValidation.authJWT),
  authController.authJWTController
);

router.get(
  "/requestAccessToken",
  jwtValidate,
  validate(authValidation.requestAccessToken),
  authController.requestAccessToken
);

module.exports = router;
