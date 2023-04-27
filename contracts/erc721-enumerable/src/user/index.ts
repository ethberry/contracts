import { Contract } from "ethers";

import { shouldSetUser } from "./setUser";
import { shouldUserOf } from "./userOf";
import { shouldUserExprires } from "./userExpires";
import { TMintERC721EnumFn } from "../shared/interfaces/IMintERC721Fn";
import { defaultMintERC721Enum } from "../shared/defaultMintERC721";

export function shouldBehaveLikeERC721Rentable(
  factory: () => Promise<Contract>,
  mint: TMintERC721EnumFn = defaultMintERC721Enum,
) {
  shouldSetUser(factory, mint);
  shouldUserOf(factory, mint);
  shouldUserExprires(factory, mint);
}
