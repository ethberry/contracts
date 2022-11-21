import { Contract } from "ethers";

import { shouldSetTokenRoyalty } from "./setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "./setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "./royaltyInfo";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC721Royalty(factory: () => Promise<Contract>) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
  shouldBurn(factory);
}

export { shouldSetTokenRoyalty, shouldSetDefaultRoyalty, shouldGetRoyaltyInfo, shouldBurn };
