const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const path = require("path");

const config = require("../config/config");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const jwtGenerate = (address) => {
  const accessToken = jwt.sign({ address }, config.jwtSecretKey, {
    expiresIn: "3m",
    algorithm: "HS256",
  });

  return accessToken;
};

const jwtRefreshTokenGenerate = (address) => {
  const refreshToken = jwt.sign({ address }, config.jwtSecretKey, {
    expiresIn: "1d",
    algorithm: "HS256",
  });

  return refreshToken;
};

const jwtVerifyToken = (token) => {
  const verifyToken = jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
    if (err) throw new Error(error);
  });
  console.log(verifyToken);

  return verifyToken;
};

module.exports = {
  jwtGenerate,
  jwtRefreshTokenGenerate,
  jwtVerifyToken,
};
