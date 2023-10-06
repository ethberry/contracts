import { shouldSetTokenMetadata } from "./setTokenMetadata";
import { shouldGetTokenMetadata } from "./getTokenMetadata";
import { shouldDeleteRecordField } from "./deleteRecordField";
import { shouldGetRecordCount } from "./getRecordCount";
import { shouldGetRecordFieldKeyCount } from "./getRecordFieldKeyCount";
import { shouldIsRecord } from "./isRecord";
import { shouldGetRecordFieldValue } from "./getRecordFieldValue";
import { shouldIsRecordFieldKey } from "./isRecordFieldKey";
import { shouldDeleteRecord } from "./deleteRecord";
import type { IERC721EnumOptions } from "../shared/defaultMint";

export function shouldBehaveLikeERC721Metadata(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  shouldSetTokenMetadata(factory, options);
  shouldGetTokenMetadata(factory, options);
  shouldDeleteRecord(factory, options);
  shouldDeleteRecordField(factory, options);
  shouldGetRecordCount(factory, options);
  shouldGetRecordFieldKeyCount(factory, options);
  shouldIsRecord(factory, options);
  shouldIsRecordFieldKey(factory, options);
  shouldGetRecordFieldValue(factory, options);
}

export {
  shouldSetTokenMetadata,
  shouldGetTokenMetadata,
  shouldDeleteRecordField,
  shouldGetRecordCount,
  shouldGetRecordFieldKeyCount,
  shouldIsRecord,
  shouldGetRecordFieldValue,
  shouldIsRecordFieldKey,
  shouldDeleteRecord,
};
