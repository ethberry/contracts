import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldTransfer } from "./transfer";
import { shouldTransferFrom } from "./transferFrom";
import { shouldApprove } from "./approve";

export function shouldBehaveLikeERC20(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  shouldMint(factory, options);
  shouldBalanceOf(factory);
  shouldTransfer(factory);
  shouldTransferFrom(factory);
  shouldApprove(factory);
}
