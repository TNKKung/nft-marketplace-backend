const joi = require("joi");

const loginMessage = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const authJWT = {
  query: joi.object().keys({
    address: joi.string().required(),
    signature: joi.string().required(),
  }),
};

const requestAccessToken = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

module.exports = { loginMessage, authJWT, requestAccessToken };
