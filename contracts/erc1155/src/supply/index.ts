import { Contract } from "ethers";

import { shouldBurn } from "./burn";
import { shouldBurnBatch } from "./burnBatch";
import { shouldGetTotalSupply } from "./totalSupply";
import { IMintERC1155Fns } from "../shared/interfaces/IMintERC1155Fn";
import { defaultMintERC1155Fns } from "../shared/defaultMintERC1155";

export function shouldBehaveLikeERC1155Supply(factory: () => Promise<Contract>, fns: IMintERC1155Fns) {
  fns = Object.assign({}, defaultMintERC1155Fns, fns); // Set default values
  shouldBurn(factory, fns.mint);
  shouldBurnBatch(factory, fns.mintBatch);
  shouldGetTotalSupply(factory, fns);
}
