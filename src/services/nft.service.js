const { store } = require("../config/firebase");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");
const Web3 = require("web3");
// const Moralis = require("moralis").default;
// const { EvmChain } = require("@moralisweb3/common-evm-utils");

const { getProvider } = require("../utils/provider");
const config = require("../config/config");
const abi = require("../config/abi.json");

const storeNFTs = store.collection("NFTs");
const storeUsers = store.collection("Users");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createNFTService = async (body) => {
  const provider = getProvider(11155111);

  const abi = [
    "function collaboratotOf(uint256 tokenId) view returns (address[])",
  ];

  const signer = new ethers.Wallet(config.privateKey, provider);

  const contract = new ethers.Contract(
    "0x1C2e4a65351c3C0968D2624a15b3B446E4fcee11",
    abi,
    signer
  );

  const {
    tokenId,
    ownerAddres,
    nameNFT,
    description,
    category,
    collectionId,
    transactionHash,
  } = body;

  const result = await contract.functions.collaboratotOf(tokenId);

  const response = await storeNFTs.add({
    ownerAddres: ownerAddres,
    nameNFT: nameNFT,
    description: description,
    category: category,
    collectionId: collectionId,
    tokenId: tokenId,
    transactionHash: [transactionHash],
    createdCollaborator: result[0],
    statusSale: false,
  });

  const data = await storeUsers.doc(ownerAddres).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeUsers.doc(ownerAddres).set({
      address: data.data().address,
      name: data.data().name,
      bio: data.data().bio,
      twitter: data.data().twitter,
      instagram: data.data().instagram,
      contact: data.data().contact,
      profileImage: data.data().profileImage,
      backgroundImage: data.data().backgroundImage,
      messageToSign: data.data().messageToSign,
      favoriteNFT: data.data().favoriteNFT,
      friendList: data.data().friendList,
      NFTHistories: data.data().NFTHistories
        ? [...data.data().NFTHistories, body.tokenId]
        : [tokenId],
    });
  }
  return response;
};

const getAllNFT = async () => {
  const NFTs = await storeNFTs.get();
  const data = [];
  const returnData = [];
  const provider = getProvider(11155111);

  const signer = new ethers.Wallet(config.privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(
    "0x1C2e4a65351c3C0968D2624a15b3B446E4fcee11",
    abi,
    signer
  );
  NFTs.docs.map((doc) => {
    data.push({ ...doc.data() });
  });

  for (let i = 0; i < data.length; i++) {
    const result = await contract.functions.tokenURI(data[i].tokenId);
    returnData.push({ ...data[i], tokenURI: result[0] });
  }
  return returnData;
};

const getAllTransaction = async (id) => {
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
  const NFTs = await storeNFTs.doc(id).get();

  let temp = [];
  const provider = getProvider(11155111);
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://rpc2.sepolia.org/ ")
  );

  for (let i = 0; i < NFTs.data().transactionHash.length; i += 1) {
    const hexHash = NFTs.data().transactionHash[i];
    const transactionReceipts = await provider.getTransactionReceipt(hexHash);
    const topic = transactionReceipts.logs[0].topics[0];

    const tx = await web3.eth.getTransaction(hexHash);
    const block = await web3.eth.getBlock(tx.blockNumber);
    console.log("timestamp :", block.timestamp);

    const date = new Date(block.timestamp * 1000);
    const formatDate = date.toLocaleDateString();
    const formatTime = date.toLocaleTimeString();

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
        // console.log(`Matched event: ${event.name}`);
        // console.log("Event data:", eventData);

        temp.push({
          event: event.name,
          eventData: eventData,
          date: formatDate,
          time: formatTime,
        });
      }
    }
  }
  console.log(temp);

  return temp;
};

const getNFTByOwnerService = async (address) => {
  const storeN = await storeNFTs.get();
  let tempStore = [];
  let storeOfOwner = [];
  storeN.docs.map((doc) => tempStore.push(doc.data()));
  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].ownerAddres === address) {
      storeOfOwner.push(tempStore[i]);
    }
  }
  return storeOfOwner;
};

const getNFTByTokenId = async (tokenId) => {
  const storeN = await storeNFTs.get();
  let tempStore = [];
  let nftOfTokenId = [];
  const provider = getProvider(11155111);

  const signer = new ethers.Wallet(config.privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(
    "0x1C2e4a65351c3C0968D2624a15b3B446E4fcee11",
    abi,
    signer
  );

  storeN.docs.map((doc) => tempStore.push({ id: doc.id, ...doc.data() }));
  const result = await contract.functions.tokenURI(tempStore[0].tokenId);

  for (let i = 0; i < tempStore.length; i++) {
    if (tempStore[i].tokenId.toString() === tokenId) {
      nftOfTokenId.push({ ...tempStore[i], tokenURI: result[0] });
    }
  }
  return nftOfTokenId;
};

const deleteNFTByTokenId = async (tokenId) => {
  await storeNFTs.doc(tokenId).delete();
  return "delete NFT Success";
};

const listingForSale = async (id) => {
  const data = await storeNFTs.doc(id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeNFTs.doc(id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddres: data.data().ownerAddres,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: true,
    });
  }
  return "listing for sale";
};

const unlistingForSale = async (id) => {
  const data = await storeNFTs.doc(id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeNFTs.doc(id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddres: data.data().ownerAddres,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: false,
    });
  }
  return "unlisting for sale";
};

const updateCollectionOfNft = async (body) => {
  const data = await storeNFTs.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeNFTs.doc(body.id).set({
      tokenId: data.data().tokenId,
      collectionId: body.collectionId,
      ownerAddres: data.data().ownerAddres,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: data.data().statusSale,
    });
  }
  return "update new collectionId";
};

const addTransactionHash = async (body) => {
  const data = await storeNFTs.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeNFTs.doc(body.id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddres: data.data().ownerAddres,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: [...data.data().transactionHash, body.transactionHash],
      statusSale: data.data().statusSale,
    });
  }
  return "add transaction hash complete";
};

const updateOwnerNFT = async (body) => {
  const data = await storeNFTs.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    const provider = getProvider(11155111);

    const signer = new ethers.Wallet(config.privateKey, provider);

    const address = body.contract;
    const abi = ["function ownerOf(uint256 tokenId) view returns (address)"];

    const contract = new ethers.Contract(address, abi, signer);
    const result = await contract.functions.ownerOf(data.data().tokenId);

    await storeNFTs.doc(body.id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddres: result[0],
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: data.data().statusSale,
    });
  }
  return "update new owner";
};

module.exports = {
  createNFTService,
  getAllNFT,
  getNFTByOwnerService,
  getNFTByTokenId,
  deleteNFTByTokenId,
  updateCollectionOfNft,
  updateOwnerNFT,
  listingForSale,
  unlistingForSale,
  addTransactionHash,
  getAllTransaction,
};
