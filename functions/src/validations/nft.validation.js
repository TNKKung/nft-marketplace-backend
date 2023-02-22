const joi = require("joi");

const createNFT = {
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

const getAllNFT = {
  body: joi.object().keys({}),
};

const getNFTByOwner = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const getNFTCreatedByOwner = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const getNFTByTokenId = {
  query: joi.object().keys({
    tokenId: joi.number().required(),
  }),
};

const listingForSale = {
  query: joi.object().keys({
    ownerAddress: joi.string().required(),
  }),
  body: joi.object().keys({
    id: joi.string().required(),
  }),
};

const unlistingForSale = {
  query: joi.object().keys({
    ownerAddress: joi.string().required(),
  }),
  body: joi.object().keys({
    id: joi.string().required(),
  }),
};

const updateCollectionOfNft = {
  body: joi.object().keys({
    id: joi.string().required(),
    collectionId: joi.string().required(),
  }),
};

const updateOwnerNFT = {
  body: joi.object().keys({
    id: joi.string().required(),
    contract: joi.string().required(),
  }),
};

const deleteNFTByTokenId = {
  query: joi.object().keys({
    id: joi.string().required(),
  }),
};

module.exports = {
  createNFT,
  getAllNFT,
  getNFTByOwner,
  getNFTByTokenId,
  deleteNFTByTokenId,
  listingForSale,
  unlistingForSale,
  updateCollectionOfNft,
  updateOwnerNFT,
  getNFTCreatedByOwner,
};
