const httpStatus = require("http-status");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const axios = require("axios");
const Web3 = require("web3");

const catchAsync = require("../utils/catchAsync");
const { nftService } = require("../services");
const config = require("../config/config");
const abi = require("../config/abi.json");
const { getProvider } = require("../utils/provider");

const createNFTController = catchAsync(async (req, res) => {
  const response = await nftService.createNFTService(req.body);
  res.status(httpStatus.CREATED).send({ response });
});

const getAllNFTs = catchAsync(async (req, res) => {
  const response = await nftService.getAllNFT();
  res.status(httpStatus.CREATED).send({ response });
});

const getNFTByOwnerController = catchAsync(async (req, res) => {
  const { address } = req.query;
  const response = await nftService.getNFTByOwnerService(address);
  res.send({ response });
});

const getNFTByTokenIdController = catchAsync(async (req, res) => {
  const { tokenId } = req.query;
  const response = await nftService.getNFTByTokenId(tokenId);
  res.send({ response });
});

const deleteNFTByTokenIdController = catchAsync(async (req, res) => {
  const { id } = req.query;
  const response = await nftService.deleteNFTByTokenId(id);
  res.send({ response });
});

const listingForSaleController = catchAsync(async (req, res) => {
  const response = await nftService.listingForSale(req.body.id);
  res.send({ response });
});

const unlistingForSaleController = catchAsync(async (req, res) => {
  const response = await nftService.unlistingForSale(req.body.id);
  res.send({ response });
});

const updateCollectionOfNFTController = catchAsync(async (req, res) => {
  const response = await nftService.updateCollectionOfNft(req.body);
  res.send({ response });
});

const updateOwnerNFTController = catchAsync(async (req, res) => {
  const response = await nftService.updateOwnerNFT(req.body);
  res.send({ response });
});

const addTransactionHashController = catchAsync(async (req, res) => {
  const response = await nftService.addTransactionHash(req.body);
  res.send({ response });
});

const getAllTransaction = catchAsync(async (req, res) => {
  // await Moralis.start({
  //   apiKey: config.moralisApiKey,
  //   // ...and any other configuration
  // });
  // const address = "0xDCfC2c24585328b905d06Fa15739163f01828FEb";
  // const chain = EvmChain.SEPOLIA;
  // const response = await Moralis.EvmApi.events.getContractLogs({
  //   address: address,
  //   chain: chain,
  // });
  // console.log(response.toJSON());
  let temp = [];
  const provider = getProvider(11155111);
  // for (let i = 0; i < dataLogs.result.length; i += 1) {
  const hexHash =
    "0xcbed851b503cfcc6a4293904dc72703bd08763a4aae67a32c0c66c3661ccaa76";
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://rpc.sepolia.online/")
  );
  const transactionReceipts = await provider.getTransactionReceipt(hexHash);
  const topic = transactionReceipts.logs[0].topics[0];
  for (const event of abi) {
    if (event.type !== "event") {
      continue;
    }
    const eventSignature = web3.eth.abi.encodeEventSignature(event);
    if (topic === eventSignature) {
      // Decode the log data using the event definition
      const eventData = web3.eth.abi.decodeLog(
        event.inputs,
        transactionReceipts.logs[0].data,
        transactionReceipts.logs[0].topics.slice(1)
      );
      // Use the decoded data as needed
      console.log(`Matched event: ${event.name}`);
      console.log("Event data:", eventData);
    }
  }
  // }
  // console.log(contract);
});

module.exports = {
  createNFTController,
  getAllNFTs,
  getNFTByOwnerController,
  getNFTByTokenIdController,
  deleteNFTByTokenIdController,
  updateCollectionOfNFTController,
  updateOwnerNFTController,
  listingForSaleController,
  unlistingForSaleController,
  getAllTransaction,
  addTransactionHashController,
};
