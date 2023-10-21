import { shouldGetRecordCount } from "./getRecordCount";
import { shouldIsRecord } from "./isRecord";
import { shouldIsRecordFieldKey } from "./isRecordFieldKey";
import { shouldGetRecordFieldKeyCount } from "./getRecordFieldKeyCount";
import { shouldGetRecordFieldValue } from "./getRecordFieldValue";
import { shouldDeleteRecord } from "./deleteRecord";
import { shouldDeleteRecordField } from "./deleteRecordField";
import { shouldUpsertRecordField } from "./upsertRecordField";

export function shouldBehaveLikeMetadata(factory: () => Promise<any>) {
  shouldIsRecord(factory);
  shouldIsRecordFieldKey(factory);
  shouldGetRecordCount(factory);
  shouldGetRecordFieldKeyCount(factory);
  shouldGetRecordFieldValue(factory);
  shouldDeleteRecord(factory);
  shouldDeleteRecordField(factory);
  shouldUpsertRecordField(factory);
}
