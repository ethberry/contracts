import { Contract } from "ethers";

import { IERC721Options } from "../shared/defaultMint";
import { shouldSetTokenRoyalty } from "./setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "./setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "./royaltyInfo";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC721Royalty(factory: () => Promise<Contract>, options: IERC721Options = {}) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
  shouldBurn(factory, options);
}

export { shouldSetTokenRoyalty, shouldSetDefaultRoyalty, shouldGetRoyaltyInfo, shouldBurn };
