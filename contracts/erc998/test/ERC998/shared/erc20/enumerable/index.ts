import { Contract } from "ethers";

import { shouldErc20ContractByIndex } from "./erc20ContractByIndex";

export function shouldERC998ERC20Enumerable(factory: () => Promise<Contract>) {
  shouldErc20ContractByIndex(factory);
}
