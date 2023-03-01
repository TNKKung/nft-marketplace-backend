const { ethers } = require("ethers");

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider("https://rpc2.sepolia.org/ ");
};

module.exports = { getProvider };
