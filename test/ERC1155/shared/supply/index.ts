import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";

export function shouldERC1155Supply() {
  shouldBurn();
  shouldBurnBatch();
}
