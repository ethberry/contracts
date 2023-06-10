import { ethers } from "hardhat";
import { BigNumberish } from "ethers";

import {
  baseTokenURI,
  batchSize,
  royalty,
  tokenMaxAmount,
  tokenName,
  tokenSymbol,
} from "@gemunion/contracts-constants";

export async function deployERC721(name: string): Promise<any> {
  const erc721Factory = await ethers.getContractFactory(name);

  if (name === "ERC721BaseUrlTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  } else if (name === "ERC721DropboxTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, tokenMaxAmount, royalty);
  } else {
    const args: Array<BigNumberish> = [tokenName, tokenSymbol];
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
