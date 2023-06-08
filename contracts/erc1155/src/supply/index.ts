import type { IERC1155Options } from "../shared/defaultMint";
import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";
import { shouldGetTotalSupply } from "./totalSupply";

export function shouldBehaveLikeERC1155Supply(factory: () => Promise<any>, options?: IERC1155Options) {
  shouldBurn(factory, options);
  shouldBurnBatch(factory, options);
  shouldGetTotalSupply(factory, options);
}
