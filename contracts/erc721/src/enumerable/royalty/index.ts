import { Contract } from "ethers";

import { shouldSetTokenRoyalty } from "../../basic/royalty/setTokenRoyalty";
import { shouldSetDefaultRoyalty } from "../../basic/royalty/setDefaultRoyalty";
import { shouldGetRoyaltyInfo } from "../../basic/royalty/royaltyInfo";
import { shouldBurn } from "./burn";

export function shouldBehaveLikeERC721Royalty(factory: () => Promise<Contract>) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
  shouldBurn(factory);
}
