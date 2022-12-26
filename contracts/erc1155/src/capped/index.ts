import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldMintBatch } from "./mintBatch";

export function shouldBehaveLikeERC1155Capped(factory: () => Promise<Contract>) {
  shouldMint(factory);
  shouldMintBatch(factory);
}
