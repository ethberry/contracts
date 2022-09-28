import { ethers } from "hardhat";
import { amount, tokenName, tokenSymbol } from "../../constants";

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

  const erc20Instance = await erc20Factory.deploy(...args);

  return {
    contractInstance: erc20Instance,
  };
}

export async function deployErc20Wallet() {
  const erc20NonReceiverFactory = await ethers.getContractFactory("ERC20NonReceiverMock");
  const erc20NonReceiverInstance = await erc20NonReceiverFactory.deploy();

  return {
    contractInstance: erc20NonReceiverInstance,
  };
}

export async function deployErc20Borrower() {
  const erc20FlashBorrower = await ethers.getContractFactory("ERC3156FlashBorrowerMock");
  const erc20FlashBorrowerInstance = await erc20FlashBorrower.deploy(true, true);

  return {
    contractInstance: erc20FlashBorrowerInstance,
  };
}
