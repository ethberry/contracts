import { ethers } from "hardhat";

import { amount, royalty, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployERC998(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);
  return erc721Factory.deploy(tokenName, tokenSymbol, royalty);
}

export async function deployErc20Base(name: string) {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol, amount);
}
