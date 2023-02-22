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
  res.send({ response });
});

const getNFTCreatedByOwnerController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await nftService.getNFTCreatedByOwnerService(address);
  res.send({ response });
});

const getNFTByTokenIdController = catchAsync(async (req, res) => {
  const { tokenId } = req.query;
  const response = await nftService.getNFTByTokenId(tokenId);
  res.send({ response });
});

const deleteNFTByTokenIdController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await nftService.deleteNFTByTokenId(id);
  res.send({ response });
});

const listingForSaleController = catchAsync(async (req, res) => {
  const { id } = req.body;
  const { ownerAddress } = req.query;
  const response = await nftService.listingForSale(id, ownerAddress);
  res.send({ response });
});

const unlistingForSaleController = catchAsync(async (req, res) => {
  const { id } = req.body;
  const { ownerAddress } = req.query;
  const response = await nftService.unlistingForSale(id, ownerAddress);
  res.send({ response });
});

const updateCollectionOfNFTController = catchAsync(async (req, res) => {
  const response = await nftService.updateCollectionOfNft(req.body);
  res.send({ response });
});

const updateOwnerNFTController = catchAsync(async (req, res) => {
  const response = await nftService.updateOwnerNFT(req.body);
  res.send({ response });
});

const addTransactionHashController = catchAsync(async (req, res) => {
  const response = await nftService.addTransactionHash(req.body);
  res.send({ response });
});

const getAllTransaction = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await nftService.getAllTransaction(id);
  res.send({ response });
});

module.exports = {
  createNFTController,
  getAllNFTs,
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
