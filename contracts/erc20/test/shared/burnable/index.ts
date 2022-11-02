import { shouldBalanceOf } from "./balanceOf";
import { shouldBurnFrom } from "./burnFrom";
import { shouldBurn } from "./burn";

export function shouldERC20Burnable(name: string) {
  shouldBalanceOf(name);
  shouldBurn(name);
  shouldBurnFrom(name);
}
