import { ethers } from "hardhat";

export async function deployErc20Borrower() {
  const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
  const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

  return {
    contractInstance: erc20FlashBorrowerInstance,
  };
}
