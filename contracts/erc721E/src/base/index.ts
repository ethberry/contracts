import { Contract } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { shouldMint } from "./mint";
import { shouldGetBalanceOf } from "./balanceOf";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeMint } from "./safeMint";
import { shouldGetOwnerOf } from "./ownerOf";
import { shouldApprove } from "./approve";
import { shouldTransferFrom } from "./transferFrom";
import { getGetCurrentTokenIndex } from "./getCurrentTokenIndex";

export function shouldBehaveLikeERC721(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldMint(factory, options);
  shouldSafeMint(factory, options);
  shouldGetOwnerOf(factory, options);
  shouldApprove(factory, options);
  shouldSetApprovalForAll(factory, options);
  shouldGetBalanceOf(factory, options);
  shouldTransferFrom(factory, options);
  shouldSafeTransferFrom(factory, options);
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