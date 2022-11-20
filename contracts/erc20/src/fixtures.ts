import { ethers } from "hardhat";

import { amount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployErc20Base(name: string) {
  const erc20Factory = await ethers.getContractFactory(name);

  const args = name
    .substr(5)
    .split("")
    .reduce(
      (memo, current) => {
        switch (current) {
          case "C":
            memo.push(amount);
            break;
          default:
            break;
        }

        return memo;
      },
      [tokenName, tokenSymbol] as Array<string | number>,
    );

  return erc20Factory.deploy(...args);
}

export async function deployErc20Borrower() {
  const factory = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
  return factory.deploy(true, true);
}
