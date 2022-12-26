import { Contract } from "ethers";

import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";

export function shouldBehaveLikeERC1155Burnable(factory: () => Promise<Contract>) {
  shouldBurn(factory);
  shouldBurnBatch(factory);
}
