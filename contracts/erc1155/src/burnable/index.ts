import { Contract } from "ethers";

import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";

export function shouldBurnable(factory: () => Promise<Contract>) {
  shouldBurn(factory);
  shouldBurnBatch(factory);
}
