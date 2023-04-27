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
import { IMintERC721Fns } from "../shared/interfaces/IMintERC721Fn";
import { defaultMintERC721Fns } from "../shared/defaultMintERC721";

export function shouldBehaveLikeERC721(
  factory: () => Promise<Contract>,
  fns: IMintERC721Fns = defaultMintERC721Fns,
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
  fns = Object.assign({}, defaultMintERC721Fns, fns);
  const { mint, safeMint } = fns;

  shouldMint(factory, mint, options);
  shouldSafeMint(factory, safeMint, options);
  shouldGetOwnerOf(factory, mint, options);
  shouldApprove(factory, mint, options);
  shouldSetApprovalForAll(factory, mint, options);
  shouldGetBalanceOf(factory, mint, options);
  shouldTransferFrom(factory, mint, options);
  shouldSafeTransferFrom(factory, mint, options);
}
