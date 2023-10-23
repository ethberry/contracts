import type { IERC721EnumOptions, TERC721MetadataOptions } from "../shared/defaultMint";
import { shouldSetTokenMetadata } from "./setTokenMetadata";
import { shouldGetTokenMetadata } from "./getTokenMetadata";
import { shouldGetRecordFieldValue } from "./getRecordFieldValue";

export function shouldBehaveLikeERC721Metadata(
  factory: () => Promise<any>,
  options: IERC721EnumOptions = {},
  metadata: TERC721MetadataOptions = [],
) {
  shouldGetTokenMetadata(factory, options, metadata);
  shouldGetRecordFieldValue(factory, options, metadata);
  // shouldSetTokenMetadata(factory, options, metadata);
}

export { shouldSetTokenMetadata, shouldGetTokenMetadata };
