import { ethers } from "hardhat";

import { baseTokenURI, royalty, tokenName, tokenSymbol } from "@gemunion/contracts-test-constants";

export async function deployErc721Base(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);

  if (name === "ERC721BaseUrlTest") {
    const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty, baseTokenURI);

    return {
      contractInstance: erc721Instance,
    };
  } else if (name === "ERC721DropboxTest") {
    const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, 1);

    return {
      contractInstance: erc721Instance,
    };
  } else if (name === "ERC721ABERM") {
    const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, 1, { gasLimit: 40966424 });

    return {
      contractInstance: erc721Instance,
    };
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

    const erc721Instance = await erc721Factory.deploy(...args);

    return {
      contractInstance: erc721Instance,
    };
  }
}

export async function deployErc721NonReceiver() {
  const erc721NonReceiverFactory = await ethers.getContractFactory("ERC721NonReceiverMock");
  const erc721NonReceiverInstance = await erc721NonReceiverFactory.deploy();

  return {
    contractInstance: erc721NonReceiverInstance,
  };
}

export async function deployErc721Receiver() {
  const erc721ReceiverFactory = await ethers.getContractFactory("ERC721ReceiverMock");
  const erc721ReceiverInstance = await erc721ReceiverFactory.deploy();

  return {
    contractInstance: erc721ReceiverInstance,
  };
}
