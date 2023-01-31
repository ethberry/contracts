import { Contract } from "ethers";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldMintBatch } from "./mintBatch";
import { shouldBalanceOfBatch } from "./balanceOfBatch";
import { shouldURI } from "./uri";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeBatchTransferFrom } from "./safeBatchTransferFrom";

export function shouldBehaveLikeERC1155(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  shouldMint(factory, Object.assign({ minterRole: MINTER_ROLE }, options));
  shouldMintBatch(factory, Object.assign({ minterRole: MINTER_ROLE }, options));
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
