import { shouldSetTokenRoyalty } from "../../royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../../royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../../royalty/royaltyInfo";
import { shouldBurn } from "./burn";

export function shouldERC721Royalty(name: string) {
  shouldSetTokenRoyalty(name);
  shouldSetDefaultRoyalty(name);
  shouldGetRoyaltyInfo(name);
  shouldBurn(name);
}
