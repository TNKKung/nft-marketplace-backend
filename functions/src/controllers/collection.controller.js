const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const { collectionService } = require("../services");

const createCollectionController = catchAsync(async (req, res) => {
  const response = await collectionService.createCollectionService(req.body);
  res.status(httpStatus.CREATED).send({ response });
});

const getAllCollectionController = catchAsync(async (req, res) => {
  const response = await collectionService.getAllCollectionService();
  res.status(200).send({ response });
});

const getLengthCollectionController = catchAsync(async (req, res) => {
  const response = await collectionService.getLengthCollection();
  res.status(200).send({ response });
});

const getCollectionExploreController = catchAsync(async (req, res) => {
  const response = await collectionService.getAllExploreCollectionService();
  res.send({ response });
});

const getCollectionByIdController = catchAsync(async (req, res) => {
  const response = await collectionService.getCollectionByIdService(
    req.query.id
  );
  res.status(200).send({ response });
});

const getCollectionByOwnerController = catchAsync(async (req, res) => {
  const response = await collectionService.getCollectionByOwnerService(
    req.query.owner
  );
  res.status(200).send({ response });
});

const deleteCollectionByIdController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await collectionService.deleteCollectionByIdService(id);
  res.status(200).send({ response });
});

const updateCollectionController = catchAsync(async (req, res) => {
  const response = await collectionService.updateCollectionService(req.body);
  res.status(200).send({ response });
});

module.exports = {
  createCollectionController,
  getLengthCollectionController,
  getAllCollectionController,
  getCollectionByIdController,
  getCollectionByOwnerController,
  deleteCollectionByIdController,
  updateCollectionController,
  getCollectionExploreController,
};
