import { shouldMint } from "./mint";
import { shouldMintBatch } from "./mintBatch";

export function shouldERC1155Capped() {
  shouldMint();
  shouldMintBatch();
}
