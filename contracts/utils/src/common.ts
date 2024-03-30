import { ethers } from "hardhat";

export async function deployContract(name: string): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy();
}
