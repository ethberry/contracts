import { shouldSafeTransferChild } from "./safeTransferChild";
import { shouldChildContractsFor } from "./childContractsFor";
import { shouldChildExists } from "./childExists";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldTransferChild } from "./transferChild";

export function shouldERC998Base(name: string) {
  shouldSafeTransferChild(name);
  shouldTransferChild(name);
  shouldChildContractsFor(name);
  shouldChildExists(name);
  shouldSafeTransferFrom(name);
}
