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
import { IMintERC1155Fns } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155Fns } from "../shared/defaultMintERC1155";

export function shouldBehaveLikeERC1155(
  factory: () => Promise<Contract>,
  fns: IMintERC1155Fns = defaultMintERC1155Fns,
  options: Record<string, any> = {},
) {
  const { mint, mintBatch } = Object.assign({}, defaultMintERC1155Fns, fns);
  options = Object.assign(
    {},
    {
      minterRole: MINTER_ROLE,
    },
    options,
  );

  shouldMint(factory, mint, options);
  shouldMintBatch(factory, mintBatch, options);
  shouldBalanceOf(factory, mint);
  shouldBalanceOfBatch(factory, mint);
  shouldURI(factory);
  shouldSetApprovalForAll(factory, mint);
  shouldSafeTransferFrom(factory, mint);
  shouldSafeBatchTransferFrom(factory, mint);
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
