import { Contract } from "ethers";

import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";

export function shouldERC1155Burnable(factory: () => Promise<Contract>) {
  shouldBurn(factory);
  shouldBurnBatch(factory);
}
