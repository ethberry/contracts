import { ethers } from "hardhat";

// error TS2742: The inferred type of 'deployErc20' cannot be named without a reference to '@gemunion/contracts-constants/node_modules/ethers'. This is likely not portable. A type annotation is necessary
// https://github.com/microsoft/TypeScript/issues/47663
import type {} from "ethers";

import { tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployErc20(name: string) {
  const factory = await ethers.getContractFactory(name);
  return factory.deploy(tokenName, tokenSymbol);
}
