import { Wallet } from "ethers";

export const getBurnerWallet = () => {
  const privateKey = localStorage.getItem("mud:burnerWallet");
  if (privateKey) return new Wallet(privateKey);

  const burnerWallet = Wallet.createRandom();
  localStorage.setItem("mud:burnerWallet", burnerWallet.privateKey);
  return burnerWallet;
};
