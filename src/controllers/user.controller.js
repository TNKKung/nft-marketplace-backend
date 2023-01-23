const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const { userService } = require("../services");

const getAllUserController = catchAsync(async (req, res) => {
  const response = await userService.getAllUsers();
  res.status(httpStatus.CREATED).send({ response });
});

const getUserByAddressController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await userService.getUserByAddress(address);
  res.send({ response });
});

const addFriendListController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { friendAddress } = req.body;
  const response = await userService.addFriendList(address, friendAddress);
  res.send({ response });
});

const addFavoriteNFTController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { tokenId } = req.body;
  const response = await userService.addFavoriteNFT(address, tokenId);
  res.send({ response });
});

module.exports = {
  getAllUserController,
  getUserByAddressController,
  addFriendListController,
  addFavoriteNFTController,
};
