import { Contract } from "ethers";

import { shouldSetTokenRoyalty } from "./setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "./setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "./royaltyInfo";

export function shouldBehaveLikeERC1155Royalty(factory: () => Promise<Contract>) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
}
