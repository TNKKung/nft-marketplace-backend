const express = require("express");

const validate = require("../middlewares/validate");
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

module.exports = router;
