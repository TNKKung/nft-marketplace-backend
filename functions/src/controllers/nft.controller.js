const httpStatus = require("http-status");

const catchAsync = require("../utils/catchAsync");
const { nftService } = require("../services");

const createNFTController = catchAsync(async (req, res) => {
  const response = await nftService.createNFTService(req.body);
  res.status(httpStatus.CREATED).send({ response });
});

const getAllNFTsController = catchAsync(async (req, res) => {
  const response = await nftService.getAllNFTService();
  res.send({ response });
});

const getAllSaleNFTsController = catchAsync(async (req, res) => {
  const response = await nftService.getAllSaleNFTService();
  res.send({ response });
});

const getNFTByOwnerController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await nftService.getNFTByOwnerService(address);
  res.send({ response });
});

const getNFTCreatedByOwnerController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await nftService.getNFTCreatedByOwnerService(address);
  res.send({ response });
});

const getNFTByTokenIdController = catchAsync(async (req, res) => {
  const { tokenId } = req.query;
  const response = await nftService.getNFTByTokenIdService(tokenId);
  res.send({ response });
});

const deleteNFTByTokenIdController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await nftService.deleteNFTByTokenIdService(id);
  res.send({ response });
});

const listingForSaleController = catchAsync(async (req, res) => {
  const { id } = req.body;
  const { ownerAddress } = req.query;
  const response = await nftService.listingForSaleService(id, ownerAddress);
  res.send({ response });
});

const unlistingForSaleController = catchAsync(async (req, res) => {
  const { id } = req.body;
  const { ownerAddress } = req.query;
  const response = await nftService.unlistingForSaleService(id, ownerAddress);
  res.send({ response });
});

const updateCollectionOfNFTController = catchAsync(async (req, res) => {
  const response = await nftService.updateCollectionOfNftService(req.body);
  res.send({ response });
});

const updateOwnerNFTController = catchAsync(async (req, res) => {
  const response = await nftService.updateOwnerNFTService(req.body);
  res.send({ response });
});

const addTransactionHashController = catchAsync(async (req, res) => {
  const response = await nftService.addTransactionHashService(req.body);
  res.send({ response });
});

const getAllTransaction = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await nftService.getAllTransactionService(id);
  res.send({ response });
});

module.exports = {
  createNFTController,
  getAllNFTsController,
  getAllSaleNFTsController,
  getNFTByOwnerController,
  getNFTByTokenIdController,
  deleteNFTByTokenIdController,
  updateCollectionOfNFTController,
  updateOwnerNFTController,
  listingForSaleController,
  unlistingForSaleController,
  getAllTransaction,
  addTransactionHashController,
  getNFTCreatedByOwnerController,
};
