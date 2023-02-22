const { store } = require("../config/firebase");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");
const Web3 = require("web3");

const { getProvider } = require("../utils/provider");
const config = require("../config/config");
const abi = require("../config/abi.json");

const storeNFTs = store.collection("NFTs");
const storeUsers = store.collection("Users");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createNFTService = async (body) => {
  const provider = getProvider();

  const abi = [
    "function collaboratotOf(uint256 tokenId) view returns (address[])",
  ];

  const signer = new ethers.Wallet(config.privateKey, provider);

  const contract = new ethers.Contract(
    "0x985F253fB2F1b47acAAA6fcdc1D00178f7E7B207",
    abi,
    signer
  );

  const {
    tokenId,
    ownerAddress,
    nameNFT,
    description,
    category,
    collectionId,
    transactionHash,
  } = body;

  const NFTs = await storeNFTs.get();

  const checkTokenInStore = NFTs.docs.filter(
    (doc) => doc.data().tokenId === tokenId
  );

  if (checkTokenInStore.length !== 0) {
    return "already token in store";
  }

  const result = await contract.functions.collaboratotOf(tokenId);

  const response = await storeNFTs.add({
    ownerAddress: ownerAddress,
    nameNFT: nameNFT,
    description: description,
    category: category,
    collectionId: collectionId,
    tokenId: tokenId,
    transactionHash: [transactionHash],
    createdCollaborator: result[0],
    statusSale: false,
    createdOwner: ownerAddress,
  });

  const data = await storeUsers.doc(ownerAddress).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    await storeUsers.doc(ownerAddress).set({
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
        ? [...data.data().NFTHistories, tokenId]
        : [tokenId],
    });
  }
  return response;
};

const getAllNFT = async () => {
  const NFTs = await storeNFTs.get();
  const returnData = [];
  const provider = getProvider();

  const signer = new ethers.Wallet(config.privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(
    "0x985F253fB2F1b47acAAA6fcdc1D00178f7E7B207",
    abi,
    signer
  );
  const data = NFTs.docs.map((doc) => {
    return { ...doc.data() };
  });

  for (let i = 0; i < data.length; i++) {
    const result = await contract.functions.tokenURI(data[i].tokenId);
    returnData.push({ ...data[i], tokenURI: result[0] });
  }
  return returnData;
};

const getAllTransaction = async (id) => {
  const NFTs = await storeNFTs.doc(id).get();

  let temp = [];
  const provider = getProvider();
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
        const eventData = web3.eth.abi.decodeLog(
          event.inputs,
          transactionReceipts.logs[0].data,
          transactionReceipts.logs[0].topics.slice(1)
        );

        temp.push({
          event: event.name,
          eventData: eventData,
          date: formatDate,
          time: formatTime,
        });
      }
    }
  }

  return temp;
};

const getNFTByOwnerService = async (address) => {
  const NFTs = await storeNFTs.get();
  const dataNFTs = NFTs.docs.map((doc) => doc.data());
  const storeOfOwner = dataNFTs.filter(
    (dataNFT) => dataNFT.ownerAddress === address
  );
  return storeOfOwner;
};

const getNFTCreatedByOwnerService = async (address) => {
  const NFTs = await storeNFTs.get();
  const dataNFTs = NFTs.docs.map((doc) => doc.data());
  const storeOfOwner = dataNFTs.filter(
    (dataNFT) => dataNFT.createdOwner === address
  );
  return storeOfOwner;
};

const getNFTByTokenId = async (tokenId) => {
  const storeNFT = await storeNFTs.get();
  const provider = getProvider();
  let nftOfTokenId = [];

  const signer = new ethers.Wallet(config.privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(
    "0x985F253fB2F1b47acAAA6fcdc1D00178f7E7B207",
    abi,
    signer
  );

  const storeNFTDatas = storeNFT.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });

  for (let i = 0; i < storeNFTDatas.length; i++) {
    if (storeNFTDatas[i].tokenId === tokenId) {
      const result = await contract.functions.tokenURI(
        storeNFTDatas[i].tokenId
      );
      nftOfTokenId.push({ ...storeNFTDatas[i], tokenURI: result[0] });
    }
  }
  return nftOfTokenId;
};

const deleteNFTByTokenId = async (tokenId) => {
  await storeNFTs.doc(tokenId).delete();
  return "delete NFT Success";
};

const listingForSale = async (id, ownerAddress) => {
  const data = await storeNFTs.doc(id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    if (ownerAddress !== data.data().ownerAddress) {
      return "Not the owner of the NFT";
    } else if (data.data().statusSale === true) {
      return "NFT already for sale";
    }
    await storeNFTs.doc(id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddress: data.data().ownerAddress,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: true,
      createdOwner: data.data().createdOwner,
    });
  }
  return "listing for sale";
};

const unlistingForSale = async (id, ownerAddress) => {
  const data = await storeNFTs.doc(id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    if (ownerAddress !== data.data().ownerAddress) {
      return "Not the owner of the NFT";
    } else if (data.data().statusSale === false) {
      return "NFT is currently not listed on the marketplace";
    }
    await storeNFTs.doc(id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddress: data.data().ownerAddress,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: false,
      createdOwner: data.data().createdOwner,
    });
  }
  return "unlisting for sale";
};

const updateCollectionOfNft = async (body) => {
  const { id, collectionId, ownerAddress } = body;
  const data = await storeNFTs.doc(id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    if (data.data().ownerAddress !== ownerAddress) {
      return "Not the owner of the NFT";
    }
    await storeNFTs.doc(id).set({
      tokenId: data.data().tokenId,
      collectionId: collectionId,
      ownerAddress: data.data().ownerAddress,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: data.data().statusSale,
      createdOwner: data.data().createdOwner,
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
      ownerAddress: data.data().ownerAddress,
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: [...data.data().transactionHash, body.transactionHash],
      statusSale: data.data().statusSale,
      createdOwner: data.data().createdOwner,
    });
  }
  return "add transaction hash complete";
};

const updateOwnerNFT = async (body) => {
  const data = await storeNFTs.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    const provider = getProvider();

    const signer = new ethers.Wallet(config.privateKey, provider);

    const address = body.contract;
    const abi = ["function ownerOf(uint256 tokenId) view returns (address)"];

    const contract = new ethers.Contract(address, abi, signer);
    const result = await contract.functions.ownerOf(data.data().tokenId);

    await storeNFTs.doc(body.id).set({
      tokenId: data.data().tokenId,
      collectionId: data.data().collectionId,
      ownerAddress: result[0],
      nameNFT: data.data().nameNFT,
      description: data.data().description,
      category: data.data().category,
      createdCollaborator: data.data().createdCollaborator,
      transactionHash: data.data().transactionHash,
      statusSale: data.data().statusSale,
      createdOwner: data.data().createdOwner,
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
  getNFTCreatedByOwnerService,
};
