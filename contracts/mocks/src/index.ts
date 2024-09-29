import "@nomicfoundation/hardhat-toolbox";
import { ethers } from "hardhat";

import { baseTokenURI, tokenName, tokenSymbol } from "@ethberry/contracts-constants";

export async function deployERC20Mock(name = "ERC20Mock"): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol);
}

export async function deployERC721Mock(name = "ERC721Mock"): Promise<any> {
  const erc721Factory = await ethers.getContractFactory(name);
  return erc721Factory.deploy(tokenName, tokenSymbol);
}

export async function deployERC1155Mock(name = "ERC1155Mock"): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(baseTokenURI);
}

export async function deployERC1363Mock(name = "ERC1363Mock"): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol);
}
