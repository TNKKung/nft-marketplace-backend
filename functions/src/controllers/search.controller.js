const httpStatus = require("http-status");

const { searchService } = require("../services");

const catchAsync = require("../utils/catchAsync");

const allSearchController = catchAsync(async (req, res) => {
  const { keyword } = req.query;
  const response = await searchService.getAllSearchListService(keyword);

  res.send({ response });
});

const nftsSearchController = catchAsync(async (req, res) => {
  const { keyword } = req.query;
  const response = await searchService.getNFTsSearchService(keyword);

  res.send({ response });
});

const usersSearchController = catchAsync(async (req, res) => {
  const { keyword } = req.query;
  const response = await searchService.getUsersSearchService(keyword);

  res.send({ response });
});
const collectionsSearchController = catchAsync(async (req, res) => {
  const { keyword } = req.query;
  const response = await searchService.getCollectionSearchService(keyword);

  res.send({ response });
});

module.exports = {
  allSearchController,
  nftsSearchController,
  usersSearchController,
  collectionsSearchController,
};
