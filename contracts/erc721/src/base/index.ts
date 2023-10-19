import type { IERC721Options } from "../shared/defaultMint";
import { shouldMint } from "./mint";
import { shouldGetBalanceOf } from "./balanceOf";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeMint } from "./safeMint";
import { shouldGetOwnerOf } from "./ownerOf";
import { shouldApprove } from "./approve";
import { shouldTransferFrom } from "./transferFrom";

export function shouldBehaveLikeERC721(factory: () => Promise<any>, options?: IERC721Options) {
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
};
