import { Contract } from "ethers";

import { shouldGetRoyaltyInfo, shouldSetDefaultRoyalty, shouldSetTokenRoyalty } from "@gemunion/contracts-erc721";

import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC721Royalty(factory: () => Promise<Contract>) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
  shouldBurn(factory);
}

export { shouldSetTokenRoyalty, shouldSetDefaultRoyalty, shouldGetRoyaltyInfo, shouldBurn };
