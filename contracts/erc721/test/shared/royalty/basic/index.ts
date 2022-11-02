import { shouldSetTokenRoyalty } from "../setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../royaltyInfo";
import { shouldBurn } from "./burn";

export function shouldERC721Royalty(name: string) {
  shouldSetTokenRoyalty(name);
  shouldSetDefaultRoyalty(name);
  shouldGetRoyaltyInfo(name);
  shouldBurn(name);
}
