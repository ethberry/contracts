import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";

export function shouldERC1155Burnable(name: string) {
  shouldBurn(name);
  shouldBurnBatch(name);
}
