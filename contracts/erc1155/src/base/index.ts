import type { IERC1155Options } from "../shared/defaultMint";
import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldMintBatch } from "./mintBatch";
import { shouldBalanceOfBatch } from "./balanceOfBatch";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "./safeBatchTransferFrom";

export function shouldBehaveLikeERC1155(factory: () => Promise<any>, options?: IERC1155Options) {
  shouldMint(factory, options);
  shouldMintBatch(factory, options);
  shouldBalanceOf(factory, options);
  shouldBalanceOfBatch(factory, options);
  shouldSetApprovalForAll(factory, options);
  shouldSafeTransferFrom(factory, options);
  shouldSafeBatchTransferFrom(factory, options);
}

export {
  shouldMint,
  shouldBalanceOf,
  shouldMintBatch,
  shouldBalanceOfBatch,
  shouldSetApprovalForAll,
  shouldSafeTransferFrom,
  shouldSafeBatchTransferFrom,
};
