import { Contract } from "ethers";

import { shouldBalanceOf } from "./balanceOf";
import { shouldBurnFrom } from "./burnFrom";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC20Burnable(factory: () => Promise<Contract>) {
  shouldBalanceOf(factory);
  shouldBurn(factory);
  shouldBurnFrom(factory);
}

export { shouldBalanceOf, shouldBurnFrom, shouldBurn };
