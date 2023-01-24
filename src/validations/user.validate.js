const joi = require("joi");

const getAllUsers = {
  body: joi.object().keys({}),
};

const getUserByAddress = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
};

const addFriendList = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    friendAddress: joi.string().required(),
  }),
};

const unfriendList = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    friendAddress: joi.string().required(),
  }),
};

const addFavoriteNFT = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    tokenId: joi.string().required(),
    nameNFT: joi.string().required(),
    category: joi.object().required().keys({
      label: joi.string().required(),
      value: joi.string().required(),
    }),
  }),
};

const removeFavoriteNFT = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    tokenId: joi.string().required(),
  }),
};

const editInfoUser = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    name: joi.string().required(),
    bio: joi.string().required(),
    twitter: joi.string().required(),
    instagram: joi.string().required(),
    contact: joi.string().required(),
  }),
};

const editImageProfile = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    profileImage: joi.string().required(),
  }),
};

const editImageBackground = {
  query: joi.object().keys({
    address: joi.string().required(),
  }),
  body: joi.object().keys({
    backgroundImage: joi.string().required(),
  }),
};

module.exports = {
  getAllUsers,
  getUserByAddress,
  addFriendList,
  unfriendList,
  addFavoriteNFT,
  removeFavoriteNFT,
  editInfoUser,
  editImageProfile,
  editImageBackground,
};
