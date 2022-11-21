import { Contract } from "ethers";

import { shouldBalanceOfERC20 } from "./balanceOfERC20";
import { shouldGetERC20 } from "./getERC20";

export function shouldBehaveLikeERC998ERC20(factory: () => Promise<Contract>) {
  shouldBalanceOfERC20(factory);
  shouldGetERC20(factory);
}
