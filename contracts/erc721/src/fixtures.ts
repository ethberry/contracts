import { ethers } from "hardhat";

import type {} from "ethers"; // The inferred type of 'deployERC721' cannot be named without a reference to '@gemunion/contracts-constants/node_modules/ethers'. This is likely not portable. A type annotation is necessary.ts(2742)
// https://github.com/microsoft/TypeScript/issues/47663
import {
  baseTokenURI,
  royalty,
  batchSize,
  tokenMaxAmount,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";

export async function deployERC721(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);

  if (name === "ERC721BaseUrlTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  } else if (name === "ERC721DropboxTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, tokenMaxAmount, royalty);
  } else {
    const args: Array<string | number> = [tokenName, tokenSymbol];
    const parts = name.substr(6);

    if (parts.includes("C")) {
      if (parts.includes("K")) {
        args.push(batchSize + tokenMaxAmount);
      } else {
        args.push(tokenMaxAmount);
      }
    }

    if (parts.includes("R")) {
      args.push(royalty);
    }

    return erc721Factory.deploy(...args);
  }
}
