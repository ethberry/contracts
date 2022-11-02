import { shouldBalanceOfERC20 } from "./balanceOfERC20";
import { shouldGetERC20 } from "./getERC20";

export function shouldERC998ERC20(name: string) {
  shouldBalanceOfERC20(name);
  shouldGetERC20(name);
}
