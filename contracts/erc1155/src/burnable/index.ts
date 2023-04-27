import { Contract } from "ethers";

import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";
import { IMintERC1155Fns } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155Fns } from "../shared/defaultMintERC1155";

export function shouldBehaveLikeERC1155Burnable(
  factory: () => Promise<Contract>,
  fns: IMintERC1155Fns = defaultMintERC1155Fns,
) {
  const { mint, mintBatch } = Object.assign({}, defaultMintERC1155Fns, fns);

  shouldBurn(factory, mint);
  shouldBurnBatch(factory, mintBatch);
}
