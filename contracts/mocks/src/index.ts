import "@nomicfoundation/hardhat-toolbox";
import { ethers } from "hardhat";

export async function deployContract(name: string): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy();
}

export async function deployWallet() {
  return deployContract("Wallet");
}

export async function deployJerk() {
  return deployContract("Jerk");
}
