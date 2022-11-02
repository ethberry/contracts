import { ethers } from "hardhat";

import { baseTokenURI, royalty } from "../constants";

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

  const erc1155Instance = await erc1155Factory.deploy(...args);

  return {
    contractInstance: erc1155Instance,
  };
}

export async function deployErc1155NonReceiver() {
  const erc1155NonReceiverFactory = await ethers.getContractFactory("ERC1155NonReceiverMock");
  const erc1155NonReceiverInstance = await erc1155NonReceiverFactory.deploy();

  return {
    contractInstance: erc1155NonReceiverInstance,
  };
}

export async function deployErc1155Receiver() {
  const erc1155ReceiverFactory = await ethers.getContractFactory("ERC1155ReceiverMock");
  const erc1155ReceiverInstance = await erc1155ReceiverFactory.deploy();

  return {
    contractInstance: erc1155ReceiverInstance,
  };
}
