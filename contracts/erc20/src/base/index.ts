import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldTransfer } from "./transfer";
import { shouldTransferFrom } from "./transferFrom";
import { shouldApprove } from "./approve";
import { MINTER_ROLE } from "@gemunion/contracts-constants";

export function shouldBehaveLikeERC20(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  shouldMint(factory, Object.assign({ minterRole: MINTER_ROLE }, options));
  shouldBalanceOf(factory);
  shouldTransfer(factory);
  shouldTransferFrom(factory);
  shouldApprove(factory);
}
