import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldMintBatch } from "./mintBatch";
import { shouldBalanceOfBatch } from "./balanceOfBatch";
import { shouldURI } from "./uri";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "./safeBatchTransferFrom";

export function shouldBehaveLikeERC1155(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  shouldMint(factory, options);
  shouldMintBatch(factory, options);
  shouldBalanceOf(factory);
  shouldBalanceOfBatch(factory);
  shouldURI(factory);
  shouldSetApprovalForAll(factory);
  shouldSafeTransferFrom(factory);
  shouldSafeBatchTransferFrom(factory);
}

export {
  shouldMint,
  shouldBalanceOf,
  shouldMintBatch,
  shouldBalanceOfBatch,
  shouldURI,
  shouldSetApprovalForAll,
  shouldSafeTransferFrom,
  shouldSafeBatchTransferFrom,
};
