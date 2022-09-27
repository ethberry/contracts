import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldMintBatch } from "./mintBatch";
import { shouldBalanceOfBatch } from "./balanceOfBatch";
import { shouldURI } from "./uri";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "./safeBatchTransferFrom";

export function shouldERC1155Base() {
  shouldMint();
  shouldMintBatch();
  shouldBalanceOf();
  shouldBalanceOfBatch();
  shouldURI();
  shouldSetApprovalForAll();
  shouldSafeTransferFrom();
  shouldSafeBatchTransferFrom();
}
