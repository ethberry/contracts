import { shouldSetTokenRoyalty } from "../../../../shared/royalty/setTokenRoyalty";
import { shouldGetRoyaltyInfo } from "../../../../shared/royalty/royaltyInfo";
import { shouldSetDefaultRoyalty } from "../../../../shared/royalty/setDefaultRoyalty";
import { shouldBurn } from "./burn";

export function shouldERC721Royalty() {
  shouldSetTokenRoyalty();
  shouldSetDefaultRoyalty();
  shouldGetRoyaltyInfo();
  shouldBurn();
}
