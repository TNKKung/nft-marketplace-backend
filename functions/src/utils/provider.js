const httpStatus = require("http-status");
const { ethers } = require("ethers");

const ApiError = require("./apiError");

const getProvider = () => {
  if ("https://rpc.sepolia.org".startsWith("wss")) {
    return new ethers.providers.WebSocketProvider("https://rpc.sepolia.org");
  }

  return new ethers.providers.JsonRpcProvider("https://rpc.sepolia.org");
};

module.exports = { getProvider };
