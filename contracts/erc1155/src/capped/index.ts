import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldMintBatch } from "./mintBatch";
import { IMintERC1155Fns } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155Fns } from "../shared/defaultMintERC1155";

export function shouldBehaveLikeERC1155Capped(
  factory: () => Promise<Contract>,
  fns: IMintERC1155Fns = defaultMintERC1155Fns,
) {
  fns = Object.assign({}, defaultMintERC1155Fns, fns);
  shouldMint(factory, fns.mint);
  shouldMintBatch(factory, fns);
}
