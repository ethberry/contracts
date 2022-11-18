import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldMintBatch } from "./mintBatch";
import { shouldBalanceOfBatch } from "./balanceOfBatch";
import { shouldURI } from "./uri";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "./safeBatchTransferFrom";

export function shouldERC1155Base(factory: () => Promise<Contract>) {
  shouldMint(factory);
  shouldMintBatch(factory);
  shouldBalanceOf(factory);
  shouldBalanceOfBatch(factory);
  shouldURI(factory);
  shouldSetApprovalForAll(factory);
  shouldSafeTransferFrom(factory);
  shouldSafeBatchTransferFrom(factory);
}
