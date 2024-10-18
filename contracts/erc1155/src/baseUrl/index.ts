import type { IERC1155Options } from "../shared/defaultMint";
import { shouldURI } from "./uri";
import { shouldSetBaseURI } from "./setBaseURI";

export function shouldBehaveLikeERC1155BaseUrl(factory: () => Promise<any>, _options?: IERC1155Options) {
  shouldURI(factory);
  shouldSetBaseURI(factory);
}

export { shouldURI };
