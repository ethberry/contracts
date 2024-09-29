import { ethers } from "hardhat";
import { BigNumberish } from "ethers";

import { baseTokenURI, royalty, tokenMaxAmount, tokenName, tokenSymbol } from "@ethberry/contracts-constants";

export async function deployERC721(name: string): Promise<any> {
  const erc721Factory = await ethers.getContractFactory(name);

  if (name === "ERC721BaseUrlTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  } else if (name === "ERC721MetaDataTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, royalty);
  } else {
    const args: Array<BigNumberish> = [tokenName, tokenSymbol];
    const parts = name.substr(6);

    if (parts.includes("C")) {
      args.push(tokenMaxAmount);
    }

    if (parts.includes("R")) {
      args.push(royalty);
    }

    return erc721Factory.deploy(...args);
  }
}
