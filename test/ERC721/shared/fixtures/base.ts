import { ethers } from "hardhat";
import { royalty, tokenName, tokenSymbol } from "../../../constants";

export async function deployErc721Base(name: string) {
  const erc721Factory = await ethers.getContractFactory(name);

  const is998 = name.substring(0, 6) === "ERC998";

  if (is998) {
    const erc721Instance = await erc721Factory.deploy(tokenName, tokenSymbol, royalty);

    return {
      contractInstance: erc721Instance,
    };
  } else {
    const args = name
      .substr(6)
      .split("")
      .reduce(
        (memo, current) => {
          switch (current) {
            case "C":
              memo.push(2);
              break;
            case "R":
              memo.push(royalty);
              break;
            default:
              break;
          }

          return memo;
        },
        [tokenName, tokenSymbol] as Array<string | number>,
      );

    const erc721Instance = await erc721Factory.deploy(...args);

    return {
      contractInstance: erc721Instance,
    };
  }
}
