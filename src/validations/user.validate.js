const joi = require("joi");

const getAllUsers = {
  body: joi.object().keys({}),
};

const getUserByAddress = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

module.exports = {
  getAllUsers,
  getUserByAddress,
};
