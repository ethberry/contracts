import { Contract } from "ethers";

import { MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldSetTokenRoyalty } from "./setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "./setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "./royaltyInfo";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC721Royalty(
  factory: () => Promise<Contract>,
  options: Record<string, any> = {
    minterRole: MINTER_ROLE,
    initialBalance: 0,
  },
) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
  shouldBurn(factory, options);
}

export { shouldSetTokenRoyalty, shouldSetDefaultRoyalty, shouldGetRoyaltyInfo, shouldBurn };
