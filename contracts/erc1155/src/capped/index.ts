import { Contract } from "ethers";

import type { IERC1155Options } from "../shared/defaultMint";
import { shouldMint } from "./mint";
import { shouldMintBatch } from "./mintBatch";

export function shouldBehaveLikeERC1155Capped(factory: () => Promise<Contract>, options?: IERC1155Options) {
  shouldMint(factory, options);
  shouldMintBatch(factory, options);
}
