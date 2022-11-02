import { ethers } from "hardhat";

export async function deployAccessList(name: string) {
  const contractFactory = await ethers.getContractFactory(name);
  const contractInstance = await contractFactory.deploy();

  return {
    contractInstance,
  };
}
