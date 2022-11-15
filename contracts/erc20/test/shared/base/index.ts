import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldTransfer } from "./transfer";
import { shouldTransferFrom } from "./transferFrom";
import { shouldApprove } from "./approve";

export function shouldERC20Base(factory: () => Promise<Contract>) {
  shouldMint(factory);
  shouldBalanceOf(factory);
  shouldTransfer(factory);
  shouldTransferFrom(factory);
  shouldApprove(factory);
}
