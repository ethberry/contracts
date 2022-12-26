import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldGetBalanceOf } from "./balanceOf";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeMint } from "./safeMint";
import { shouldGetOwnerOf } from "./ownerOf";
import { shouldApprove } from "./approve";
import { shouldTransferFrom } from "./transferFrom";

export function shouldBehaveLikeERC721(factory: () => Promise<Contract>, options: Record<string, any> = {}) {
  shouldMint(factory, options);
  shouldSafeMint(factory, options);
  shouldGetOwnerOf(factory);
  shouldApprove(factory);
  shouldSetApprovalForAll(factory);
  shouldGetBalanceOf(factory);
  shouldTransferFrom(factory);
  shouldSafeTransferFrom(factory);
}
