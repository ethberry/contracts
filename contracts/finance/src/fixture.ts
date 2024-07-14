import { ethers } from "hardhat";

import { tokenName, tokenSymbol, baseTokenURI } from "@gemunion/contracts-constants";

export async function deployPaymentSplitter(name: string): Promise<any> {
  const [owner, receiver] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(name);
  return factory.deploy([owner.address, receiver.address], [50, 50]);
}

export async function deployERC1363(name: string): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol);
}

export async function deployERC20(name: string): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol);
}

export async function deployERC721(name: string): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol);
}

export async function deployERC1155(name: string): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(baseTokenURI);
}
