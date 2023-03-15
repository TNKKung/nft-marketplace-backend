const { store } = require("../config/firebase");
const { ethers } = require("ethers");
const dotenv = require("dotenv");
const path = require("path");
const Web3 = require("web3");

const { getProvider } = require("../utils/provider");
const {
  privateKey,
  nftContract,
  marketplaceContract,
} = require("../config/config");
const abi = require("../config/abi.json");

const storeNFTs = store.collection("NFTs");
const storeUsers = store.collection("Users");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const createNFTService = async (body) => {
  const provider = getProvider();

  const abi = [
    "function collaboratotOf(uint256 tokenId) view returns (address[])",
  ];

  const signer = new ethers.Wallet(privateKey, provider);

  const contract = new ethers.Contract(nftContract, abi, signer);

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

const getAllNFTService = async () => {
  const NFTs = await storeNFTs.get();

  return NFTs.docs.map((doc) => {
    return doc.data();
  });
};

const getAllTransactionService = async (id) => {
  const NFTs = await storeNFTs.doc(id).get();

  let temp = [];
  const provider = getProvider();
  const web3 = new Web3(
    new Web3.providers.HttpProvider("https://rpc2.sepolia.org/")
  );

  return Promise.all(
    NFTs.data().transactionHash.map(async (hash) => {
      console.log(hash);
      const transactionReceipts = await provider.getTransactionReceipt(hash);
      const topic = transactionReceipts.logs[0].topics[0];

      const tx = await web3.eth.getTransaction(hash);
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

          return {
            event: event.name,
            eventData: eventData,
            date: formatDate,
            time: formatTime,
          };
        }
      }
    })
  );
};

const getNFTByOwnerService = async (address) => {
  const NFTs = await storeNFTs.get();
  const provider = getProvider();
  const web3 = new Web3();

  const signer = new ethers.Wallet(privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(nftContract, abi, signer);

  const abiMarketplace = [
    "function priceFromTokenId(uint256 tokenId) view returns (uint256)",
  ];

  const marketplace = new ethers.Contract(
    marketplaceContract,
    abiMarketplace,
    signer
  );

  const dataNFTs = NFTs.docs.filter(
    (doc) => doc.data().ownerAddress === address
  );

  return Promise.all(
    dataNFTs.map(async (doc) => {
      const result = await contract.functions.tokenURI(doc.data().tokenId);
      const resultPrice = await marketplace.functions.priceFromTokenId(
        doc.data().tokenId
      );
      const wei = web3.utils.toBN(resultPrice[0]["_hex"]).toString();
      const eth = ethers.utils.formatEther(wei);
      return {
        tokenId: doc.data().tokenId,
        nameNFT: doc.data().nameNFT,
        tokenURI: result[0],
        price: doc.data().statusSale ? eth : "",
      };
    })
  );
};

const getNFTCreatedByOwnerService = async (address) => {
  const NFTs = await storeNFTs.get();
  const provider = getProvider();
  const web3 = new Web3();

  const signer = new ethers.Wallet(privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(nftContract, abi, signer);

  const abiMarketplace = [
    "function priceFromTokenId(uint256 tokenId) view returns (uint256)",
  ];

  const marketplace = new ethers.Contract(
    marketplaceContract,
    abiMarketplace,
    signer
  );

  const dataNFTs = NFTs.docs.filter(
    (doc) => doc.data().createdOwner === address
  );

  return Promise.all(
    dataNFTs.map(async (doc) => {
      const result = await contract.functions.tokenURI(doc.data().tokenId);
      const resultPrice = await marketplace.functions.priceFromTokenId(
        doc.data().tokenId
      );
      const wei = web3.utils.toBN(resultPrice[0]["_hex"]).toString();
      const eth = ethers.utils.formatEther(wei);
      return {
        tokenId: doc.data().tokenId,
        nameNFT: doc.data().nameNFT,
        tokenURI: result[0],
        price: doc.data().statusSale ? eth : "",
      };
    })
  );
};

const getNFTByTokenIdService = async (tokenId) => {
  const storeNFT = await storeNFTs.get();
  const provider = getProvider();
  const web3 = new Web3();

  const signer = new ethers.Wallet(privateKey, provider);

  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];

  const contract = new ethers.Contract(nftContract, abi, signer);

  const abiMarketplace = [
    "function priceFromTokenId(uint256 tokenId) view returns (uint256)",
  ];

  const marketplace = new ethers.Contract(
    marketplaceContract,
    abiMarketplace,
    signer
  );

  const filterData = storeNFT.docs.filter(
    (doc) => doc.data().tokenId === tokenId
  );

  return Promise.all(
    filterData.map(async (doc) => {
      const result = await contract.functions.tokenURI(doc.data().tokenId);
      const resultPrice = await marketplace.functions.priceFromTokenId(
        doc.data().tokenId
      );
      const wei = web3.utils.toBN(resultPrice[0]["_hex"]).toString();
      const eth = ethers.utils.formatEther(wei);
      return {
        id: doc.id,
        ...doc.data(),
        tokenURI: result[0],
        price: doc.data().statusSale ? eth : "",
      };
    })
  );
};

const deleteNFTByTokenIdService = async (tokenId) => {
  await storeNFTs.doc(tokenId).delete();
  return "delete NFT Success";
};

const listingForSaleService = async (id, ownerAddress) => {
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

const unlistingForSaleService = async (id, ownerAddress) => {
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

const updateCollectionOfNftService = async (body) => {
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

const addTransactionHashService = async (body) => {
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

const updateOwnerNFTService = async (body) => {
  const data = await storeNFTs.doc(body.id).get();
  if (!data.exists) {
    console.log("No such document!");
  } else {
    const provider = getProvider();

    const signer = new ethers.Wallet(privateKey, provider);

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
      statusSale: false,
      createdOwner: data.data().createdOwner,
    });
  }
  return "update new owner";
};

module.exports = {
  createNFTService,
  getAllNFTService,
  getNFTByOwnerService,
  getNFTByTokenIdService,
  deleteNFTByTokenIdService,
  updateCollectionOfNftService,
  updateOwnerNFTService,
  listingForSaleService,
  unlistingForSaleService,
  addTransactionHashService,
  getAllTransactionService,
  getNFTCreatedByOwnerService,
};
