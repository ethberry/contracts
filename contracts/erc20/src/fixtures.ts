import { ethers } from "hardhat";

// error TS2742: The inferred type of 'deployErc20' cannot be named without a reference to '@gemunion/contracts-constants/node_modules/ethers'. This is likely not portable. A type annotation is necessary
// https://github.com/microsoft/TypeScript/issues/47663
import type {} from "ethers";

import { amount, tokenName, tokenSymbol } from "@gemunion/contracts-constants";

export async function deployERC20(name: string) {
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
