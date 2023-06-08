import type { IERC20Options } from "../shared/defaultMint";
import { shouldBalanceOf2 } from "./balanceOf";
import { shouldBurnFrom } from "./burnFrom";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC20Burnable(factory: () => Promise<any>, options?: IERC20Options) {
  shouldBalanceOf2(factory, options);
  shouldBurn(factory, options);
  shouldBurnFrom(factory, options);
}

export { shouldBalanceOf2, shouldBurnFrom, shouldBurn };
