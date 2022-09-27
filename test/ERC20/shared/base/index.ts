import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldTransfer } from "./transfer";
import { shouldTransferFrom } from "./transferFrom";
import { shouldApprove } from "./approve";

export function shouldERC20Base() {
  shouldMint();
  shouldBalanceOf();
  shouldTransfer();
  shouldTransferFrom();
  shouldApprove();
}
