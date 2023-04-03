import "@nomicfoundation/hardhat-toolbox";
import { ethers } from "hardhat";

export async function deployWallet() {
  const factory = await ethers.getContractFactory("Wallet");
  return factory.deploy();
}

export async function deployJerk() {
  const factory = await ethers.getContractFactory("Jerk");
  return factory.deploy();
}
