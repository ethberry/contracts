import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldMintBatch } from "./mintBatch";
import { shouldBalanceOfBatch } from "./balanceOfBatch";
import { shouldURI } from "./uri";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "./safeBatchTransferFrom";

export function shouldERC1155Base(name: string) {
  shouldMint(name);
  shouldMintBatch(name);
  shouldBalanceOf(name);
  shouldBalanceOfBatch(name);
  shouldURI(name);
  shouldSetApprovalForAll(name);
  shouldSafeTransferFrom(name);
  shouldSafeBatchTransferFrom(name);
}
