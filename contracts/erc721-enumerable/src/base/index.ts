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
import { IMintERC721EnumFns } from "../shared/interfaces/IMintERC721EnumFn";
import { defaultMintERC721Fns } from "../shared/defaultMintERC721Enum";

export function shouldBehaveLikeERC721(
  factory: () => Promise<Contract>,
  fns: IMintERC721EnumFns = defaultMintERC721Fns,
  options: Record<string, any> = {
    minterRole: MINTER_ROLE,
    batchSize: 0,
  },
) {
  const { mint, safeMint } = fns;
  // const { mint, safeMint } = Object.assign({}, defaultMintERC721Fns, fns);
  options = Object.assign(
    {},
    {
      minterRole: MINTER_ROLE,
      batchSize: 0,
    },
    options,
  );
  if (mint) shouldMint(factory, mint, options);
  if (safeMint) shouldSafeMint(factory, safeMint, options);
  shouldGetOwnerOf(factory, mint || safeMint);
  shouldApprove(factory, mint || safeMint);
  shouldSetApprovalForAll(factory, mint || safeMint);
  shouldGetBalanceOf(factory, mint || safeMint);
  shouldTransferFrom(factory, mint || safeMint);
  shouldSafeTransferFrom(factory, mint || safeMint);
  getGetCurrentTokenIndex(factory, mint || safeMint);
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
