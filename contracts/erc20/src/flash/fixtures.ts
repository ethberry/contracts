import { ethers } from "hardhat";

export async function deployErc20Borrower() {
  const factory = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
  return factory.deploy(true, true);
}
