import type { IERC1155Options } from "../shared/defaultMint";
import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";

export function shouldBehaveLikeERC1155Burnable(factory: () => Promise<any>, options?: IERC1155Options) {
  shouldBurn(factory, options);
  shouldBurnBatch(factory, options);
}
