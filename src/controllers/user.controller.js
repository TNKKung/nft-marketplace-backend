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

const unfriendListController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { friendAddress } = req.body;
  const response = await userService.unfriendList(address, friendAddress);
  res.send({ response });
});

const addFavoriteNFTController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await userService.addFavoriteNFT(address, req.body);
  res.send({ response });
});

const removeFavoriteNFTController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { tokenId } = req.body;
  const response = await userService.removeFavoriteNFT(address, tokenId);
  res.send({ response });
});

const editInfoUserController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await userService.editInfoUser(address, req.body);
  res.send({ response });
});

const editImageProfileController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { profileImage } = req.body;
  const response = await userService.editImageProfile(address, profileImage);
  res.send({ response });
});

const editImageBackgroundController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { backgroundImage } = req.body;
  const response = await userService.editImageBackground(
    address,
    backgroundImage
  );
  res.send({ response });
});

module.exports = {
  getAllUserController,
  getUserByAddressController,
  addFriendListController,
  unfriendListController,
  addFavoriteNFTController,
  removeFavoriteNFTController,
  editInfoUserController,
  editImageProfileController,
  editImageBackgroundController,
};
