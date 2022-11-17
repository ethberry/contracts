import { Contract } from "ethers";

import { shouldBalanceOf } from "./balanceOf";
import { shouldBurnFrom } from "./burnFrom";
import { shouldBurn } from "./burn";

export function shouldERC20Burnable(factory: () => Promise<Contract>) {
  shouldBalanceOf(factory);
  shouldBurn(factory);
  shouldBurnFrom(factory);
}
