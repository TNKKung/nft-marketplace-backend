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

module.exports = {
  getAllUserController,
  getUserByAddressController,
};
