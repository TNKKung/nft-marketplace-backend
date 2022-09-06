const Web3 = require("web3");

const isValidEthAddress = (address) => Web3.utils.isAddress(address);

module.exports = { isValidEthAddress };
