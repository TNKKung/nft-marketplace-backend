const joi = require("joi");

const createNFTValidate = {
  body: joi.object().keys({
    ownerAddress: joi.string().required(),
    nameNFT: joi.string().required(),
    description: joi.string().required(),
    category: joi.array().required(),
    collectionId: joi.string().required(),
    tokenId: joi.number().required(),
    transactionHash: joi.string().required(),
  }),
};

const getNFTByOwnerValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const getNFTCreatedByOwnerValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const getNFTByTokenIdValidate = {
  query: joi.object().keys({
    tokenId: joi.number().required(),
  }),
};

const listingForSaleValidate = {
  query: joi.object().keys({
    ownerAddress: joi.string().required(),
  }),
  body: joi.object().keys({
    id: joi.string().required(),
  }),
};

const unlistingForSaleValidate = {
  query: joi.object().keys({
    ownerAddress: joi.string().required(),
  }),
  body: joi.object().keys({
    id: joi.string().required(),
  }),
};

const updateCollectionOfNftValidate = {
  body: joi.object().keys({
    id: joi.string().required(),
    collectionId: joi.string().required(),
  }),
};

const updateOwnerNFTValidate = {
  body: joi.object().keys({
    id: joi.string().required(),
    contract: joi.string().required(),
  }),
};

const deleteNFTByTokenIdValidate = {
  query: joi.object().keys({
    id: joi.string().required(),
  }),
};

module.exports = {
  createNFTValidate,
  getNFTByOwnerValidate,
  getNFTByTokenIdValidate,
  deleteNFTByTokenIdValidate,
  listingForSaleValidate,
  unlistingForSaleValidate,
  updateCollectionOfNftValidate,
  updateOwnerNFTValidate,
  getNFTCreatedByOwnerValidate,
};
