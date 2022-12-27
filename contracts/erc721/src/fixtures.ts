import { ethers } from "hardhat";

import { baseTokenURI, royalty, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployERC721(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);

  if (name === "ERC721BaseUrlTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);
  } else if (name === "ERC721DropboxTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, royalty);
  } else if (name === "ERC721ConsecutiveTest") {
    return erc721Factory.deploy(tokenName, tokenSymbol, royalty);
  } else {
    const args = name
      .substr(6)
      .split("")
      .reduce(
        (memo, current) => {
          switch (current) {
            case "C":
              memo.push(2);
              break;
            case "R":
              memo.push(royalty);
              break;
            default:
              break;
          }

          return memo;
        },
        [tokenName, tokenSymbol] as Array<string | number>,
      );

    return erc721Factory.deploy(...args);
  }
}
