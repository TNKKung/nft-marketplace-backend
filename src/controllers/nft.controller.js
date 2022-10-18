const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const { nftService } = require("../services");

const createNFTController = catchAsync(async (req, res) => {
  const response = await nftService.createNFTService(req.body);
  res.status(httpStatus.CREATED).send({ response });
});

const getAllNFTs = catchAsync(async (req, res) => {
  const response = await nftService.getAllNFT();
  res.status(httpStatus.CREATED).send({ response });
});

const getNFTByOwnerController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await nftService.getNFTByOwnerService(address);
  res.status(httpStatus).send({ response });
});

const getNFTByTokenIdController = catchAsync(async (req, res) => {
  const { tokenId } = req.query;
  const response = await nftService.getNFTByTokenId(tokenId);
  res.status(httpStatus).send({ response });
});

const deleteNFTByTokenIdController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await nftService.deleteNFTByTokenId(id);
  res.status(httpStatus).send({ response });
});

const updateCollectionOfNFTController = catchAsync(async (req, res) => {
  const response = await nftService.updateCollectionOfNft(req.body);
  res.status(httpStatus).send({ response });
});

module.exports = {
  createNFTController,
  getAllNFTs,
  getNFTByOwnerController,
  getNFTByTokenIdController,
  deleteNFTByTokenIdController,
  updateCollectionOfNFTController,
};
