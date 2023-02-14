const { ethers } = require("ethers");

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider("https://rpc.sepolia.org");
};

module.exports = { getProvider };
