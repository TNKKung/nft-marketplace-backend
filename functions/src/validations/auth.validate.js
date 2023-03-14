const joi = require("joi");

const loginMessageValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const authJWTValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
    signature: joi.string().required(),
  }),
};

const requestAccessTokenValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

module.exports = {
  loginMessageValidate,
  authJWTValidate,
  requestAccessTokenValidate,
};
