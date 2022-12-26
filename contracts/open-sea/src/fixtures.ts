import { ethers } from "hardhat";

import { royalty, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployERC721(name: string) {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol, royalty);
}
