const joi = require("joi");

const createCollection = {
  body: joi.object().keys({
    owner: joi.string().required(),
    collectionName: joi.string().required(),
    description: joi.string().required(),
  }),
};

const getAllCollection = {
  body: joi.object().keys({}),
};

const getCollectionById = {
  query: joi.object().keys({
    id: joi.string().required(),
  }),
};

const getCollectionByOwner = {
  query: joi.object().keys({
    owner: joi.string().required(),
  }),
};

const deleteCollectionById = {
  query: joi.object().keys({
    id: joi.string().required(),
  }),
};

const updateCollection = {
  body: joi.object().keys({
    id: joi.string().required(),
    collectionName: joi.string().required(),
    description: joi.string(),
  }),
};

module.exports = {
  createCollection,
  getAllCollection,
  getCollectionById,
  getCollectionByOwner,
  deleteCollectionById,
  updateCollection,
};
