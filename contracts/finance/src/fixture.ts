import { ethers } from "hardhat";

import { tokenName, tokenSymbol, amount } from "@gemunion/contracts-constants";

export async function deployPaymentSplitter(name: string): Promise<any> {
  const [owner] = await ethers.getSigners();
  const factory = await ethers.getContractFactory(name);
  return factory.deploy([owner.address], [100]);
}

export async function deployERC1363(name: string): Promise<any> {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol, amount);
}
