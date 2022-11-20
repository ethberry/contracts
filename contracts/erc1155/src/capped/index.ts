import { Contract } from "ethers";

import { shouldMint } from "./mint";
import { shouldMintBatch } from "./mintBatch";

export function shouldCapped(factory: () => Promise<Contract>) {
  shouldMint(factory);
  shouldMintBatch(factory);
}
