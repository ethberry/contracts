import { Contract } from "ethers";

import { shouldGetRoyaltyInfo, shouldSetDefaultRoyalty, shouldSetTokenRoyalty } from "@gemunion/contracts-erc721";

import { IERC721EnumOptions } from "../shared/defaultMint";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC721Royalty(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
  shouldBurn(factory, options);
}

export { shouldSetTokenRoyalty, shouldSetDefaultRoyalty, shouldGetRoyaltyInfo, shouldBurn };
