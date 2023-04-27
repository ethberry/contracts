import { Contract } from "ethers";

import { shouldGetRoyaltyInfo, shouldSetDefaultRoyalty, shouldSetTokenRoyalty } from "@gemunion/contracts-erc721";

import { shouldBurn } from "./burn";
import { TMintERC721EnumFn } from "../shared/interfaces/IMintERC721Fn";
import { defaultMintERC721Enum } from "../shared/defaultMintERC721";

export function shouldBehaveLikeERC721Royalty(
  factory: () => Promise<Contract>,
  mint: TMintERC721EnumFn = defaultMintERC721Enum,
) {
  shouldSetTokenRoyalty(factory);
  shouldSetDefaultRoyalty(factory);
  shouldGetRoyaltyInfo(factory);
  shouldBurn(factory, mint);
}

export { shouldSetTokenRoyalty, shouldSetDefaultRoyalty, shouldGetRoyaltyInfo, shouldBurn };
