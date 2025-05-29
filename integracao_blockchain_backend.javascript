// services/blockchain.js
import Web3 from 'web3';
import UserNFT from '../contracts/UserNFT.json';

const initBlockchain = async () => {
  const web3 = new Web3(process.env.BLOCKCHAIN_PROVIDER);
  const networkId = await web3.eth.net.getId();
  
  const userNFTContract = new web3.eth.Contract(
    UserNFT.abi,
    UserNFT.networks[networkId].address
  );
  
  return { web3, userNFTContract };
};

// Cria NFT de validação do usuário
export const createUserNFT = async (userId) => {
  const { web3, userNFTContract } = await initBlockchain();
  
  const accounts = await web3.eth.getAccounts();
  const adminAccount = accounts[0];
  
  const tx = await userNFTContract.methods
    .mintUserNFT(userId)
    .send({ from: adminAccount });
  
  return {
    transactionHash: tx.transactionHash,
    nftId: tx.events.UserNFTCreated.returnValues.tokenId
  };
};

// Registra atividade no blockchain
export const registerActivity = async (userId, activityData) => {
  const { web3, userNFTContract } = await initBlockchain();
  
  const activityHash = web3.utils.sha3(JSON.stringify(activityData));
  
  const tx = await userNFTContract.methods
    .registerActivity(userId, activityHash)
    .send({ from: adminAccount });
  
  return tx.transactionHash;
};