import "@nomiclabs/hardhat-waffle";
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

export async function deployErc1155NonReceiver() {
  const erc1155NonReceiverFactory = await ethers.getContractFactory("ERC1155NonReceiverMock");
  return erc1155NonReceiverFactory.deploy();
}

export async function deployErc1155Receiver() {
  const erc1155ReceiverFactory = await ethers.getContractFactory("ERC1155ReceiverMock");
  return erc1155ReceiverFactory.deploy();
}
