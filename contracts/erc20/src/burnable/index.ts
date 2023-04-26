import { Contract } from "ethers";

import { shouldBalanceOf2 } from "./balanceOf";
import { shouldBurnFrom } from "./burnFrom";
import { shouldBurn } from "./burn";
import { TMintERC20Fn } from "../shared/interfaces/IERC20MintFn";
import { defaultMintERC20 } from "../shared/defaultMint";

export function shouldBehaveLikeERC20Burnable(factory: () => Promise<Contract>, mint: TMintERC20Fn = defaultMintERC20) {
  shouldBalanceOf2(factory, mint);
  shouldBurn(factory, mint);
  shouldBurnFrom(factory, mint);
}

export { shouldBalanceOf2, shouldBurnFrom, shouldBurn };
