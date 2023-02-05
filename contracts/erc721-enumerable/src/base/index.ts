import { Contract } from "ethers";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMint } from "./mint";
import { shouldGetBalanceOf } from "./balanceOf";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeMint } from "./safeMint";
import { shouldGetOwnerOf } from "./ownerOf";
import { shouldApprove } from "./approve";
import { shouldTransferFrom } from "./transferFrom";
import { getGetCurrentTokenIndex } from "./getCurrentTokenIndex";

export function shouldBehaveLikeERC721(
  factory: () => Promise<Contract>,
  options: Record<string, any> = {
    minterRole: MINTER_ROLE,
    batchSize: 0,
  },
) {
  options = Object.assign(
    {},
    {
      minterRole: MINTER_ROLE,
      batchSize: 0,
    },
    options,
  );
  shouldMint(factory, options);
  shouldSafeMint(factory, options);
  shouldGetOwnerOf(factory);
  shouldApprove(factory);
  shouldSetApprovalForAll(factory);
  shouldGetBalanceOf(factory);
  shouldTransferFrom(factory);
  shouldSafeTransferFrom(factory);
  getGetCurrentTokenIndex(factory);
}

export {
  shouldMint,
  shouldSafeMint,
  shouldGetOwnerOf,
  shouldApprove,
  shouldSetApprovalForAll,
  shouldGetBalanceOf,
  shouldTransferFrom,
  shouldSafeTransferFrom,
  getGetCurrentTokenIndex,
};
