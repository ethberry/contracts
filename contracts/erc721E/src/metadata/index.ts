import type { IERC721EnumOptions } from "../shared/defaultMint";
import { shouldSetTokenMetadata } from "./setTokenMetadata";
import { shouldGetTokenMetadata } from "./getTokenMetadata";
import { shouldGetRecordFieldValue } from "./getRecordFieldValue";

export function shouldBehaveLikeERC721Metadata(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  shouldGetTokenMetadata(factory, options);
  shouldGetRecordFieldValue(factory, options);
  // shouldSetTokenMetadata(factory, options);
}

export { shouldSetTokenMetadata, shouldGetTokenMetadata };
