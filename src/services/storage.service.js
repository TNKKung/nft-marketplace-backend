const { storage } = require("../config/firebase");

const uploadABI = async (body) => {
  const file = {
    buffer: Buffer.from(JSON.stringify(body)),
    mimetype: "application/json",
  };

  const uploadedFile = storage.bucket("abi-storage").file(`4.jpg`);

  await uploadedFile.save(file.buffer, { contentType: file.mimetype });
  await uploadedFile.makePublic();
  console.log(1122);

  return uploadedFile.publicUrl();
};

module.exports = {
  uploadABI,
};
