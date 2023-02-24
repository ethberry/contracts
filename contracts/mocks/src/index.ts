import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";

export async function deployErc20NonReceiver() {
  const factory = await ethers.getContractFactory("ERC20NonReceiverMock");
  return factory.deploy();
}

export async function deployErc20Receiver() {
  const factory = await ethers.getContractFactory("ERC20ReceiverMock");
  return factory.deploy();
}

export async function deployErc721NonReceiver() {
  const factory = await ethers.getContractFactory("ERC721NonReceiverMock");
  return factory.deploy();
}

export async function deployErc721Receiver() {
  const factory = await ethers.getContractFactory("ERC721ReceiverMock");
  return factory.deploy();
}

export async function deployErc1155NonReceiver() {
  const factory = await ethers.getContractFactory("ERC1155NonReceiverMock");
  return factory.deploy();
}

export async function deployErc1155Receiver() {
  const factory = await ethers.getContractFactory("ERC1155ReceiverMock");
  return factory.deploy();
}
