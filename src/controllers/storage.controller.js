const Multer = require("multer");

const catchAsync = require("../utils/catchAsync");
const { storage } = require("../config/firebase");
// const { storageService } = require("../services");

const bucket = storage.bucket("gs://nft-marketplace-frontend.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const uploadProfileController = catchAsync(async (req, res) => {
  console.log("test tom");
  await storage.bucket("gs://nft-marketplace-frontend.appspot.com");
});

module.exports = { uploadProfileController };
