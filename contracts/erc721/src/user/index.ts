import type { IERC721Options } from "../shared/defaultMint";
import { shouldSetUser } from "./setUser";
import { shouldUserOf } from "./userOf";
import { shouldUserExprires } from "./userExpires";

export function shouldBehaveLikeERC721Rentable(factory: () => Promise<any>, options: IERC721Options = {}) {
  shouldSetUser(factory, options);
  shouldUserOf(factory, options);
  shouldUserExprires(factory, options);
}
