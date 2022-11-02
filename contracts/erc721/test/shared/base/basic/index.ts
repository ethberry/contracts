import { shouldMint } from "./mint";
import { shouldGetBalanceOf } from "./balanceOf";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSafeMint } from "./safeMint";
import { shouldGetOwnerOf } from "./ownerOf";
import { shouldApprove } from "./approve";
import { shouldTransferFrom } from "./transferFrom";

export function shouldERC721Base(name: string) {
  shouldMint(name);
  shouldSafeMint(name);
  shouldGetOwnerOf(name);
  shouldApprove(name);
  shouldSetApprovalForAll(name);
  shouldGetBalanceOf(name);
  shouldTransferFrom(name);
  shouldSafeTransferFrom(name);
}
