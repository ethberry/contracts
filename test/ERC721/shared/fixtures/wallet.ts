import { ethers } from "hardhat";

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
