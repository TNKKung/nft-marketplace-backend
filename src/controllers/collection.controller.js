const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");

const { collectionService } = require("../services");

const createCollectionController = catchAsync(async (req, res) => {
  const response = await collectionService.createCollection(req.body);
  res.status(httpStatus.CREATED).send({ response });
});

const getAllCollectionController = catchAsync(async (req, res) => {
  const response = await collectionService.getAllCollection();
  res.status(200).send({ response });
});

const getCollectionByIdController = catchAsync(async (req, res) => {
  const response = await collectionService.getCollectionById(req.query.id);
  res.status(200).send({ response });
});

const getCollectionByOwnerController = catchAsync(async (req, res) => {
  const response = await collectionService.getCollectionByOwner(
    req.query.owner
  );
  res.status(200).send({ response });
});

const deleteCollectionByIdController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await collectionService.deleteCollectionById(id);
  res.status(200).send({ response });
});

const updateCollectionController = catchAsync(async (req, res) => {
  const response = await collectionService.updateCollection(req.body);
  res.status(200).send({ response });
});

module.exports = {
  createCollectionController,
  getAllCollectionController,
  getCollectionByIdController,
  getCollectionByOwnerController,
  deleteCollectionByIdController,
  updateCollectionController,
};
