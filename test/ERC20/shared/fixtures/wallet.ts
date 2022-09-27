import { ethers } from "hardhat";

export async function deployErc20Wallet() {
  const erc20NonReceiverFactory = await ethers.getContractFactory("ERC20NonReceiverMock");
  const erc20NonReceiverInstance = await erc20NonReceiverFactory.deploy();

  return {
    contractInstance: erc20NonReceiverInstance,
  };
}
