import { Contract } from "ethers";

import type { IERC1155Options } from "../shared/defaultMint";
import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldMintBatch } from "./mintBatch";
import { shouldBalanceOfBatch } from "./balanceOfBatch";
import { shouldURI } from "./uri";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "./safeBatchTransferFrom";

export function shouldBehaveLikeERC1155(factory: () => Promise<Contract>, options?: IERC1155Options) {
  shouldMint(factory, options);
  shouldMintBatch(factory, options);
  shouldBalanceOf(factory, options);
  shouldBalanceOfBatch(factory, options);
  shouldURI(factory);
  shouldSetApprovalForAll(factory, options);
  shouldSafeTransferFrom(factory, options);
  shouldSafeBatchTransferFrom(factory, options);
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
