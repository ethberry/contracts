import { shouldSetTokenMetadata } from "./setTokenMetadata";
import { shouldGetTokenMetadata } from "./getTokenMetadata";
import { shouldDeleteRecordField } from "./deleteRecordField";
import { shouldGetRecordCount } from "./getRecordCount";
import { shouldGetRecordFieldKeyCount } from "./getRecordFieldKeyCount";
import { shouldIsRecord } from "./isRecord";
import { shouldGetRecordFieldValue } from "./getRecordFieldValue";
import { shouldIsRecordFieldKey } from "./isRecordFieldKey";
import { shouldDeleteRecord } from "./deleteRecord";

export function shouldBehaveLikeERC721Metadata(factory: () => Promise<any>) {
  shouldSetTokenMetadata(factory);
  shouldGetTokenMetadata(factory);
  shouldDeleteRecord(factory);
  shouldDeleteRecordField(factory);
  shouldGetRecordCount(factory);
  shouldGetRecordFieldKeyCount(factory);
  shouldIsRecord(factory);
  shouldIsRecordFieldKey(factory);
  shouldGetRecordFieldValue(factory);
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
