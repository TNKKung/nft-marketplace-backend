const joi = require("joi");

const getAllSearchValidate = {
  query: joi.object().keys({
    keyword: joi.string().required(),
  }),
};

const getNFTsSearchValidate = {
  query: joi.object().keys({
    keyword: joi.string().required(),
  }),
};

const getUsersSearchValidate = {
  query: joi.object().keys({
    keyword: joi.string().required(),
  }),
};

const getCollectionsSearchValidate = {
  query: joi.object().keys({
    keyword: joi.string().required(),
  }),
};

module.exports = {
  getAllSearchValidate,
  getNFTsSearchValidate,
  getUsersSearchValidate,
  getCollectionsSearchValidate,
};
