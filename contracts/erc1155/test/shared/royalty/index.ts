import { shouldSetTokenRoyalty } from "./setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "./setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "./royaltyInfo";

export function shouldERC1155Royalty(name: string) {
  shouldSetTokenRoyalty(name);
  shouldSetDefaultRoyalty(name);
  shouldGetRoyaltyInfo(name);
}
