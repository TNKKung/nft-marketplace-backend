const joi = require("joi");

const getAllUsersValidate = {
  body: joi.object().keys({}),
};

const getUserByAddressValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const addFriendListValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    friendAddress: joi.string().required(),
  }),
};

const unfriendListValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    friendAddress: joi.string().required(),
  }),
};

const addFavoriteNFTValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    tokenId: joi.number().required(),
  }),
};

const removeFavoriteNFTValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    tokenId: joi.number().required(),
  }),
};

const editInfoUserValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    name: joi.string().required(),
    bio: joi.string().required(),
    twitter: joi.string(),
    instagram: joi.string(),
    contact: joi.string(),
  }),
};

const editImageProfileValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    profileImage: joi.string().required(),
  }),
};

const editImageBackgroundValidate = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    backgroundImage: joi.string().required(),
  }),
};

module.exports = {
  getAllUsersValidate,
  getUserByAddressValidate,
  addFriendListValidate,
  unfriendListValidate,
  addFavoriteNFTValidate,
  removeFavoriteNFTValidate,
  editInfoUserValidate,
  editImageProfileValidate,
  editImageBackgroundValidate,
};
