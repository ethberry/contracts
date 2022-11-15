import { ethers } from "hardhat";

import { royalty, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployErc998Base(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);
  return erc721Factory.deploy(tokenName, tokenSymbol, royalty);
}
