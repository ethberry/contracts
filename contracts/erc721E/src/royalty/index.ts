import { shouldGetRoyaltyInfo, shouldSetDefaultRoyalty, shouldSetTokenRoyalty } from "@gemunion/contracts-erc721";

import type { IERC721EnumOptions } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Royalty(factory: () => Promise<any>, _options?: IERC721EnumOptions) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
}

export { shouldSetTokenRoyalty, shouldSetDefaultRoyalty, shouldGetRoyaltyInfo };
