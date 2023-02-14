const catchAsync = require("../utils/catchAsync");

const { authService } = require("../services");

const messageController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await authService.loginMessage(address);
  res.send({ response });
});

const authJWTController = catchAsync(async (req, res) => {
  const { address, signature } = req.query;
  const response = await authService.authJWT(address, signature);
  res.send({ response });
});

const requestAccessToken = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await authService.requestAccessToken(address);
  res.send({ response });
});

module.exports = {
  messageController,
  authJWTController,
  requestAccessToken,
};
