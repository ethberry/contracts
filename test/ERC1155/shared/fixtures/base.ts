import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "../../../constants";

export async function deployErc1155Base(name: string) {
  const erc1155Factory = await ethers.getContractFactory(name);

  const args = name
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

  const erc1155Instance = await erc1155Factory.deploy(...args);

  return {
    contractInstance: erc1155Instance,
  };
}
