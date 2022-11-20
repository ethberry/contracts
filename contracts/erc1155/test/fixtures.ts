import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "@gemunion/contracts-constants";

export async function deployErc1155Base(name: string) {
  const erc1155Factory = await ethers.getContractFactory(name);

  let args = [];

  if (name === "ERC1155BaseUrlTest") {
    args = [baseTokenURI];
  } else {
    args = name
      .substr(7)
      .split("")
      .reduce(
        (memo, current) => {
          switch (current) {
            case "R":
              memo.unshift(royalty);
              break;
            default:
              break;
          }

          return memo;
        },
        [baseTokenURI] as Array<string | number>,
      );
  }

  return erc1155Factory.deploy(...args);
}
