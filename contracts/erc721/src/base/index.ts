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
  shouldGetOwnerOf(factory, options);
  shouldApprove(factory, options);
  shouldSetApprovalForAll(factory, options);
  shouldGetBalanceOf(factory, options);
  shouldTransferFrom(factory, options);
  shouldSafeTransferFrom(factory, options);
}
