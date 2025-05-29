// utils/crypto.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.CRYPTO_SECRET;

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

// Exemplo de uso no backend:
const userWallet = {
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  privateKey: "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113..."
};

const encryptedWallet = encryptData(userWallet);
// Armazenar encryptedWallet no banco de dados