import { shouldSetTokenRoyalty } from "../../shared/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../../shared/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../../shared/royalty/royaltyInfo";

export function shouldERC1155Royalty() {
  shouldSetTokenRoyalty();
  shouldSetDefaultRoyalty();
  shouldGetRoyaltyInfo();
}
