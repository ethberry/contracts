import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";
import { shouldGetTotalSupply } from "./totalSupply";

export function shouldERC1155Supply(name: string) {
  shouldBurn(name);
  shouldBurnBatch(name);
  shouldGetTotalSupply(name);
}
