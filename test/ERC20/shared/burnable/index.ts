import { shouldBalanceOf } from "./balanceOf";
import { shouldBurnFrom } from "./burnFrom";
import { shouldBurn } from "./burn";

export function shouldERC20Burnable() {
  shouldBalanceOf();
  shouldBurn();
  shouldBurnFrom();
}
