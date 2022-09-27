import { shouldMint } from "./mint";
import { shouldMintBatch } from "./mintBatch";

export function shouldERC1155Capped(name: string) {
  shouldMint(name);
  shouldMintBatch(name);
}
