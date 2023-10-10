import { shouldSetTokenRoyalty } from "./setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "./setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "./royaltyInfo";
import { IERC1155Options } from "../shared/defaultMint";

export function shouldBehaveLikeERC1155Royalty(factory: () => Promise<any>, options?: IERC1155Options) {
  shouldSetTokenRoyalty(factory, options);
  shouldSetDefaultRoyalty(factory, options);
  shouldGetRoyaltyInfo(factory);
}
