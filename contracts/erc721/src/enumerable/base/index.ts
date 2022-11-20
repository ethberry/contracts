import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldGetBalanceOf } from "./balanceOf";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeMint } from "./safeMint";
import { shouldGetOwnerOf } from "./ownerOf";
import { shouldApprove } from "./approve";
import { shouldTransferFrom } from "./transferFrom";
import { getGetCurrentTokenIndex } from "./getCurrentTokenIndex";

export function shouldBase(factory: () => Promise<Contract>) {
  shouldMint(factory);
  shouldSafeMint(factory);
  shouldGetOwnerOf(factory);
  shouldApprove(factory);
  shouldSetApprovalForAll(factory);
  shouldGetBalanceOf(factory);
  shouldTransferFrom(factory);
  shouldSafeTransferFrom(factory);
  getGetCurrentTokenIndex(factory);
}
