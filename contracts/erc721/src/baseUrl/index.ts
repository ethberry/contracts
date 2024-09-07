import type { IERC721Options } from "../shared/defaultMint";

import { shouldSetBaseURI } from "./setBaseURI";
import { shouldTokenURI } from "./tokenURI";

export function shouldBehaveLikeERC721BaseUrl(factory: () => Promise<any>, options: IERC721Options = {}) {
  shouldSetBaseURI(factory, options);
  shouldTokenURI(factory, options);
}
