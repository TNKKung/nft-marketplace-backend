const express = require("express");
const Multer = require("multer");

// const { storageController } = require("../controllers");
const { storage } = require("../config/firebase");

const bucket = storage.bucket("gs://nft-marketplace-frontend.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const router = express.Router();

router.post("/", multer.single("pic"), (req, res) => {
  console.log("Upload Image");

  let file = req.file;
  if (file) {
    uploadImageToStorage(file)
      .then((success) => {
        res.status(200).send({
          status: "success",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject("Something is wrong! Unable to upload at the moment.");
    });

    // blobStream.on("finish", () => {
    //   // The public URL can be used to directly access the file via HTTP.
    //   const url = format(
    //     `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
    //   );
    //   resolve(url);
    // });
    blobStream.end(file.buffer);
  });
};

router.get("/");

module.exports = router;
