const httpStatus = require("http-status");

const { searchService } = require("../services");

const catchAsync = require("../utils/catchAsync");

const allSearchController = catchAsync(async (req, res) => {
  const { keyword } = req.query;
  const response = await searchService.getAllSearchListService(keyword);

  res.send({ response });
});

module.exports = { allSearchController };
