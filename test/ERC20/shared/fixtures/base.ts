import { ethers } from "hardhat";
import { amount, tokenName, tokenSymbol } from "../../../constants";

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
