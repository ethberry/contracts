import { Contract } from "ethers";

import type { IERC721EnumOptions } from "../shared/defaultMint";
import { shouldSetUser } from "./setUser";
import { shouldUserOf } from "./userOf";
import { shouldUserExprires } from "./userExpires";

export function shouldBehaveLikeERC721Rentable(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldSetUser(factory, options);
  shouldUserOf(factory, options);
  shouldUserExprires(factory, options);
}
