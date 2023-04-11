import { Contract } from "ethers";

import { shouldBalanceOf2 } from "./balanceOf";
import { shouldBurnFrom } from "./burnFrom";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC20Burnable(factory: () => Promise<Contract>) {
  shouldBalanceOf2(factory);
  shouldBurn(factory);
  shouldBurnFrom(factory);
}

export { shouldBalanceOf2, shouldBurnFrom, shouldBurn };
