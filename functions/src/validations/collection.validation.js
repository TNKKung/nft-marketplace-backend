const joi = require("joi");

const createCollectionValidate = {
  body: joi.object().keys({
    owner: joi.string().required(),
    collectionName: joi.string().required(),
    description: joi.string().required(),
  }),
};

const getAllCollectionValidate = {
  body: joi.object().keys({}),
};

const getCollectionByIdValidate = {
  query: joi.object().keys({
    id: joi.string().required(),
  }),
};

const getCollectionByOwnerValidate = {
  query: joi.object().keys({
    owner: joi.string().required(),
  }),
};

const deleteCollectionByIdValidate = {
  query: joi.object().keys({
    id: joi.string().required(),
  }),
};

const updateCollectionValidate = {
  body: joi.object().keys({
    id: joi.string().required(),
    collectionName: joi.string().required(),
    description: joi.string(),
  }),
};

module.exports = {
  createCollectionValidate,
  getAllCollectionValidate,
  getCollectionByIdValidate,
  getCollectionByOwnerValidate,
  deleteCollectionByIdValidate,
  updateCollectionValidate,
};
