import { Contract } from "ethers";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldTransfer } from "./transfer";
import { shouldTransferFrom } from "./transferFrom";
import { shouldApprove } from "./approve";
import { defaultMintERC20 } from "../shared/defaultMint";
import { TMintERC20Fn } from "../shared/interfaces/IERC20MintFn";

export function shouldBehaveLikeERC20(
  factory: () => Promise<Contract>,
  mint: TMintERC20Fn = defaultMintERC20,
  options: Record<string, any> = {},
) {
  shouldMint(factory, mint, Object.assign({ minterRole: MINTER_ROLE }, options));
  shouldBalanceOf(factory, mint);
  shouldTransfer(factory, mint);
  shouldTransferFrom(factory, mint);
  shouldApprove(factory);
}

export { shouldMint, shouldBalanceOf, shouldTransfer, shouldTransferFrom, shouldApprove };
