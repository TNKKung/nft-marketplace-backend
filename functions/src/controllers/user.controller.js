const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const { userService } = require("../services");

const getAllUserController = catchAsync(async (req, res) => {
  const response = await userService.getAllUsersService();
  res.status(httpStatus.CREATED).send({ response });
});

const getUserByAddressController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await userService.getUserByAddressService(address);
  res.send({ response });
});

const addFriendListController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { friendAddress } = req.body;
  const response = await userService.addFriendListService(
    address,
    friendAddress
  );
  res.send({ response });
});

const unfriendListController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { friendAddress } = req.body;
  const response = await userService.unfriendListService(
    address,
    friendAddress
  );
  res.send({ response });
});

const addFavoriteNFTController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await userService.addFavoriteNFTService(address, req.body);
  res.send({ response });
});

const removeFavoriteNFTController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { tokenId } = req.body;
  const response = await userService.removeFavoriteNFTService(address, tokenId);
  res.send({ response });
});

const editInfoUserController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await userService.editInfoUserService(address, req.body);
  res.send({ response });
});

const editImageProfileController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { profileImage } = req.body;
  const response = await userService.editImageProfileService(address, profileImage);
  res.send({ response });
});

const editImageBackgroundController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const { backgroundImage } = req.body;
  const response = await userService.editImageBackgroundService(
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
