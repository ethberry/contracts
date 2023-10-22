import type { IERC721EnumOptions } from "../shared/defaultMint";
import { shouldSetTokenMetadata } from "./setTokenMetadata";
import { shouldGetTokenMetadata } from "./getTokenMetadata";
import { shouldGetRecordFieldValue } from "./getRecordFieldValue";
import { IERC721MetadataOptions } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Metadata(
  factory: () => Promise<any>,
  options: IERC721EnumOptions = {},
  metadata: IERC721MetadataOptions = {},
) {
  shouldGetTokenMetadata(factory, options, metadata);
  shouldGetRecordFieldValue(factory, options, metadata);
  // shouldSetTokenMetadata(factory, options, metadata);
}

export { shouldSetTokenMetadata, shouldGetTokenMetadata };
